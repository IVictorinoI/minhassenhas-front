import { lazy, Suspense } from 'react'
import { AppBar, Box, Button, Container, Paper, Stack, Toolbar, Typography } from '@mui/material'
import LockOutlined from '@mui/icons-material/LockOutlined'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router'
import { useSession } from './auth/Session'
const AuthPage = lazy(() => import('./auth/AuthPage'))
const DashboardPage = lazy(() => import('./dashboard/DashboardPage'))
const PasswordsPage = lazy(() => import('./password/PasswordsPage'))
export default function App() {
    const { user, logout } = useSession()
    const location = useLocation()
    if (!user)
        return (
            <Suspense fallback={<Typography sx={{ p: 3 }}>Carregando…</Typography>}>
                <AuthPage />
            </Suspense>
        )
    return (
        <Box sx={{ minHeight: '100vh' }}>
            <AppBar position="static" elevation={0}>
                <Toolbar sx={{ gap: 2, flexWrap: 'wrap', py: 1 }}>
                    <LockOutlined />
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Minhas senhas
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            maxWidth: { xs: 140, sm: 300 },
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {user.name || user.nome || user.email}
                    </Typography>
                    <Button color="inherit" onClick={logout}>
                        Sair
                    </Button>
                </Toolbar>
            </AppBar>
            <Paper
                component="nav"
                aria-label="Navegação principal"
                square
                elevation={0}
                sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
                <Container maxWidth="lg">
                    <Stack direction="row" spacing={1} sx={{ py: 1 }}>
                        <Button
                            component={Link}
                            to="/"
                            aria-current={location.pathname === '/' ? 'page' : undefined}
                            variant={location.pathname === '/' ? 'contained' : 'text'}
                        >
                            Dashboard
                        </Button>
                        <Button
                            component={Link}
                            to="/passwords"
                            aria-current={location.pathname === '/passwords' ? 'page' : undefined}
                            variant={location.pathname === '/passwords' ? 'contained' : 'text'}
                        >
                            Senhas
                        </Button>
                    </Stack>
                </Container>
            </Paper>
            <Container component="main" maxWidth="lg" sx={{ py: { xs: 3, sm: 5 } }}>
                <Suspense fallback={<Typography>Carregando…</Typography>}>
                    <Routes>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="/passwords" element={<PasswordsPage />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Suspense>
            </Container>
        </Box>
    )
}
