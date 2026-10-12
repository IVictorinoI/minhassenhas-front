import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Alert, Box, Button, Container, Paper, Stack, TextField, Typography } from '@mui/material'
import LockOutlined from '@mui/icons-material/LockOutlined'
import { api, errorMessage, type User } from '../lib/api'
import { useSession } from './Session'
interface AuthValues {
    name: string
    email: string
    password: string
    confirm_password: string
}
export default function AuthPage() {
    const [login, setLogin] = useState(true)
    const [error, setError] = useState('')
    const { signIn } = useSession()
    const {
        register,
        handleSubmit,
        getValues,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<AuthValues>({
        defaultValues: { name: '', email: '', password: '', confirm_password: '' },
    })
    const submit = async (values: AuthValues) => {
        setError('')
        try {
            const { data } = await api.post<User>(
                login ? '/oapi/login' : '/oapi/signup',
                login ? { email: values.email, password: values.password } : values
            )
            if (!data.token || !data.email) throw new Error('Sessão inválida')
            signIn(data)
        } catch (failure) {
            setError(errorMessage(failure))
        }
    }
    return (
        <Container maxWidth="xs" sx={{ py: { xs: 4, sm: 10 } }}>
            <Paper sx={{ p: { xs: 3, sm: 4 } }}>
                <Stack spacing={3}>
                    <Box>
                        <LockOutlined color="primary" sx={{ fontSize: 40 }} />
                        <Typography component="h1" variant="h5" sx={{ fontWeight: 700 }}>
                            Minhas senhas
                        </Typography>
                        <Typography color="text.secondary">
                            {login ? 'Entre para acessar suas contas.' : 'Crie sua conta.'}
                        </Typography>
                    </Box>
                    {error && <Alert severity="error">{error}</Alert>}
                    <Stack component="form" onSubmit={handleSubmit(submit)} spacing={2}>
                        {!login && (
                            <TextField
                                label="Nome"
                                placeholder="Nome"
                                autoComplete="name"
                                {...register('name', { required: !login && 'Informe seu nome.' })}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                        )}
                        <TextField
                            label="E-mail"
                            placeholder="E-mail"
                            type="email"
                            autoComplete="username"
                            {...register('email', { required: 'Informe seu e-mail.' })}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />
                        <TextField
                            label="Senha"
                            placeholder="Senha"
                            type="password"
                            autoComplete={login ? 'current-password' : 'new-password'}
                            {...register('password', { required: 'Informe sua senha.' })}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                        />
                        {!login && (
                            <TextField
                                label="Confirmar Senha"
                                placeholder="Confirmar Senha"
                                type="password"
                                autoComplete="new-password"
                                {...register('confirm_password', {
                                    validate: (value) =>
                                        login ||
                                        value === getValues('password') ||
                                        'As senhas não coincidem.',
                                })}
                                error={!!errors.confirm_password}
                                helperText={errors.confirm_password?.message}
                            />
                        )}
                        <Button type="submit" variant="contained" disabled={isSubmitting}>
                            {isSubmitting ? 'Aguarde…' : login ? 'Entrar' : 'Registrar'}
                        </Button>
                    </Stack>
                    <Button
                        disabled={isSubmitting}
                        onClick={() => {
                            setLogin(!login)
                            setError('')
                            reset()
                        }}
                    >
                        {login ? 'Novo usuário? Registrar aqui!' : 'Já é cadastrado? Entrar aqui!'}
                    </Button>
                </Stack>
            </Paper>
        </Container>
    )
}
