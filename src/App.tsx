import { lazy, Suspense, useState } from 'react'
import {
    AppBar,
    Box,
    Button,
    Container,
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material'
import LockOutlined from '@mui/icons-material/LockOutlined'
import DashboardOutlined from '@mui/icons-material/DashboardOutlined'
import Menu from '@mui/icons-material/Menu'
import Close from '@mui/icons-material/Close'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router'
import { useSession } from './auth/Session'
const AuthPage = lazy(() => import('./auth/AuthPage'))
const DashboardPage = lazy(() => import('./dashboard/DashboardPage'))
const PasswordsPage = lazy(() => import('./password/PasswordsPage'))
const drawerWidth = 240

export default function App() {
    const { user, logout } = useSession()
    const location = useLocation()
    const theme = useTheme()
    const desktop = useMediaQuery(theme.breakpoints.up('md'))
    const [menuOpen, setMenuOpen] = useState(false)
    if (!user)
        return (
            <Suspense fallback={<Typography sx={{ p: 3 }}>Carregando…</Typography>}>
                <AuthPage />
            </Suspense>
        )
    return (
        <Box sx={{ minHeight: '100vh' }}>
            <AppBar position="sticky" elevation={0} sx={{ zIndex: theme.zIndex.drawer + 1 }}>
                <Toolbar sx={{ gap: 2 }}>
                    {!desktop && (
                        <IconButton
                            color="inherit"
                            aria-label="Abrir menu"
                            aria-controls={menuOpen ? 'main-navigation' : undefined}
                            aria-expanded={menuOpen}
                            onClick={() => setMenuOpen(true)}
                        >
                            <Menu />
                        </IconButton>
                    )}
                    <LockOutlined sx={{ display: { xs: 'none', sm: 'block' } }} />
                    <Typography variant="h6" sx={{ flexGrow: 1, whiteSpace: 'nowrap' }}>
                        Minhas senhas
                    </Typography>
                    <Typography
                        variant="body2"
                        noWrap
                        sx={{ maxWidth: 300, display: { xs: 'none', sm: 'block' } }}
                    >
                        {user.name || user.nome || user.email}
                    </Typography>
                    <Button
                        color="inherit"
                        onClick={() => {
                            setMenuOpen(false)
                            logout()
                        }}
                    >
                        Sair
                    </Button>
                </Toolbar>
            </AppBar>
            <Drawer
                variant={desktop ? 'permanent' : 'temporary'}
                open={desktop || menuOpen}
                onClose={() => setMenuOpen(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        bgcolor: '#173654',
                        color: 'white',
                    },
                }}
            >
                {desktop ? (
                    <Toolbar />
                ) : (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            p: 2,
                        }}
                    >
                        <Typography variant="h6">Menu</Typography>
                        <IconButton
                            color="inherit"
                            aria-label="Fechar menu"
                            onClick={() => setMenuOpen(false)}
                        >
                            <Close />
                        </IconButton>
                    </Box>
                )}
                <Box
                    component="nav"
                    id="main-navigation"
                    aria-label="Navegação principal"
                    sx={{ p: 1.5 }}
                >
                    <List>
                        {[
                            { to: '/', label: 'Dashboard', icon: <DashboardOutlined /> },
                            { to: '/passwords', label: 'Senhas', icon: <LockOutlined /> },
                        ].map((item) => (
                            <ListItemButton
                                key={item.to}
                                component={Link}
                                to={item.to}
                                selected={location.pathname === item.to}
                                aria-current={location.pathname === item.to ? 'page' : undefined}
                                onClick={() => setMenuOpen(false)}
                                sx={{
                                    borderRadius: 2,
                                    mb: 1,
                                    '&.Mui-selected': { bgcolor: 'rgba(255,255,255,0.16)' },
                                    '&.Mui-selected:hover, &:hover': {
                                        bgcolor: 'rgba(255,255,255,0.22)',
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        ))}
                    </List>
                </Box>
            </Drawer>
            <Box sx={{ ml: { md: `${drawerWidth}px` } }}>
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
        </Box>
    )
}
