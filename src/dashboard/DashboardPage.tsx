import { Alert, Button, Paper, Stack, Typography } from '@mui/material'
import { Link } from 'react-router'
import { usePasswords } from '../password/usePasswords'
export default function DashboardPage() {
    const query = usePasswords()
    return (
        <Stack spacing={3}>
            <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }}>
                Dashboard
            </Typography>
            <Paper sx={{ p: 3 }}>
                <Stack spacing={2}>
                    <Typography variant="h6">Suas contas em um só lugar</Typography>
                    <Typography color="text.secondary">
                        Consulte e atualize os acessos cadastrados.
                    </Typography>
                    {query.isError ? (
                        <Alert severity="error">
                            Não foi possível carregar o resumo.
                            <Button onClick={() => void query.refetch()}>Tentar novamente</Button>
                        </Alert>
                    ) : (
                        <Typography variant="h3">
                            {query.isPending ? '?' : query.data.length}
                            <Typography component="span" color="text.secondary" sx={{ ml: 1 }}>
                                senhas cadastradas
                            </Typography>
                        </Typography>
                    )}
                    <Button
                        component={Link}
                        to="/passwords"
                        variant="contained"
                        sx={{ alignSelf: 'flex-start' }}
                    >
                        Gerenciar senhas
                    </Button>
                </Stack>
            </Paper>
        </Stack>
    )
}
