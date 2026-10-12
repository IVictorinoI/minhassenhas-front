import axios from 'axios'
export interface User {
    name?: string
    nome?: string
    email: string
    token: string
}
export interface PasswordRecord {
    _id: string
    description: string
    login: string
    url: string
}
export interface PasswordValues {
    description: string
    login: string
    url: string
    password?: string
}
const baseURL = (
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.PROD ? 'https://minhassenhas-back.herokuapp.com' : 'http://localhost:3000')
).replace(/\/$/, '')
export const api = axios.create({ baseURL, timeout: 15000 })
export function errorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) return 'Sua sessão expirou. Entre novamente.'
        const errors: unknown = error.response?.data?.errors
        if (Array.isArray(errors) && errors.every((value) => typeof value === 'string'))
            return errors.join(' ')
    }
    return 'Não foi possível concluir a operação. Verifique a conexão e tente novamente.'
}
export function setToken(token?: string) {
    if (token) api.defaults.headers.common.authorization = token
    else delete api.defaults.headers.common.authorization
}
export async function listPasswords(signal: AbortSignal): Promise<PasswordRecord[]> {
    const { data } = await api.get<PasswordRecord[]>(
        '/api/passwords/myPasswords?sort=description',
        { signal }
    )
    // Apenas metadados podem entrar no cache compartilhado.
    return data.map(({ _id, description, login, url }) => ({ _id, description, login, url }))
}
export async function readSecret(id: string, signal: AbortSignal): Promise<string> {
    const { data } = await api.get<{ password: string }>('/api/passwords/viewPassword', {
        params: { _id: id },
        signal,
    })
    return data.password
}
