import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { Alert, Box, Button, CircularProgress, Stack } from '@mui/material'
import { api, errorMessage, setToken, type User } from '../lib/api'
import { queryClient } from '../lib/query'
const storageKey = '_minhassenhas_user'
function restore(): User | null {
    try {
        const value = JSON.parse(localStorage.getItem(storageKey) || 'null')
        return value && typeof value.token === 'string' && typeof value.email === 'string'
            ? value
            : null
    } catch {
        return null
    }
}
const SessionContext = createContext<{
    user: User | null
    signIn: (user: User) => void
    logout: () => void
} | null>(null)
export function useSession() {
    const session = useContext(SessionContext)
    if (!session) throw new Error('SessionProvider ausente')
    return session
}
export function SessionProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(restore)
    const [checking, setChecking] = useState(() => Boolean(user))
    const [error, setError] = useState('')
    const [attempt, setAttempt] = useState(0)
    const logout = useCallback(() => {
        setToken()
        queryClient.clear()
        setUser(null)
        setChecking(false)
        setError('')
        try {
            localStorage.removeItem(storageKey)
        } catch {
            /* sessão em memória */
        }
    }, [])
    const signIn = useCallback((value: User) => {
        queryClient.clear()
        setToken(value.token)
        setUser(value)
        setChecking(false)
        setError('')
        try {
            localStorage.setItem(storageKey, JSON.stringify(value))
        } catch {
            /* sessão em memória */
        }
    }, [])
    useEffect(() => {
        const interceptor = api.interceptors.response.use(
            (response) => response,
            (failure) => {
                if (failure.response?.status === 401) logout()
                return Promise.reject(failure)
            }
        )
        return () => api.interceptors.response.eject(interceptor)
    }, [logout])
    useEffect(() => {
        const controller = new AbortController()
        const stored = restore()
        if (!stored) {
            setChecking(false)
            return
        }
        setChecking(true)
        setError('')
        api.post<{ valid: boolean }>(
            '/oapi/validateToken',
            { token: stored.token },
            { signal: controller.signal }
        )
            .then(({ data }) => {
                if (!controller.signal.aborted) {
                    if (data.valid) signIn(stored)
                    else logout()
                }
            })
            .catch((failure) => {
                if (!controller.signal.aborted) setError(errorMessage(failure))
            })
        return () => controller.abort()
    }, [attempt, logout, signIn])
    useEffect(() => {
        const onStorage = (event: StorageEvent) => {
            if (event.key === storageKey) logout()
        }
        window.addEventListener('storage', onStorage)
        return () => window.removeEventListener('storage', onStorage)
    }, [logout])
    if (checking)
        return (
            <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 3 }}>
                {error ? (
                    <Stack spacing={2}>
                        <Alert severity="error">{error}</Alert>
                        <Button onClick={() => setAttempt((value) => value + 1)}>
                            Tentar novamente
                        </Button>
                        <Button onClick={logout}>Voltar ao login</Button>
                    </Stack>
                ) : (
                    <CircularProgress aria-label="Restaurando sessão" />
                )}
            </Box>
        )
    return (
        <SessionContext.Provider value={{ user, signIn, logout }}>
            {children}
        </SessionContext.Provider>
    )
}
