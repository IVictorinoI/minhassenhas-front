import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    IconButton,
    Paper,
    Snackbar,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from '@mui/material'
import Add from '@mui/icons-material/Add'
import EditOutlined from '@mui/icons-material/EditOutlined'
import DeleteOutlined from '@mui/icons-material/DeleteOutlined'
import { errorMessage } from '../lib/api'
import { usePasswords } from './usePasswords'
import PasswordDialog, { type DialogSelection } from './PasswordDialog'
export default function PasswordsPage() {
    const query = usePasswords()
    const queryClient = useQueryClient()
    const [selection, setSelection] = useState<DialogSelection | null>(null)
    const [notice, setNotice] = useState(false)
    return (
        <Stack spacing={3}>
            <Box>
                <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }}>
                    Senhas
                </Typography>
                <Typography color="text.secondary">Gerencie os acessos às suas contas.</Typography>
            </Box>
            <Paper sx={{ p: { xs: 2, sm: 3 } }}>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setSelection({ mode: 'create' })}
                >
                    Novo
                </Button>
                {query.isPending && (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <CircularProgress aria-label="Carregando senhas" />
                    </Box>
                )}
                {query.isError && (
                    <Alert
                        severity="error"
                        sx={{ mt: 2 }}
                        action={
                            <Button onClick={() => void query.refetch()}>Tentar novamente</Button>
                        }
                    >
                        {errorMessage(query.error)}
                    </Alert>
                )}
                {query.data && (
                    <TableContainer sx={{ mt: 2 }}>
                        <Table aria-label="Senhas cadastradas">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Descrição</TableCell>
                                    <TableCell align="right">Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {query.data.map((record) => (
                                    <TableRow key={record._id} hover>
                                        <TableCell
                                            sx={{
                                                overflowWrap: 'anywhere',
                                                maxWidth: { xs: 160, sm: 600 },
                                            }}
                                        >
                                            {record.description}
                                        </TableCell>
                                        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                                            <Tooltip title="Editar">
                                                <IconButton
                                                    aria-label="Editar"
                                                    color="primary"
                                                    onClick={() =>
                                                        setSelection({ mode: 'update', record })
                                                    }
                                                >
                                                    <EditOutlined />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Excluir">
                                                <IconButton
                                                    aria-label="Excluir"
                                                    color="error"
                                                    onClick={() =>
                                                        setSelection({ mode: 'delete', record })
                                                    }
                                                >
                                                    <DeleteOutlined />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {!query.data.length && (
                                    <TableRow>
                                        <TableCell colSpan={2}>
                                            <Typography color="text.secondary" sx={{ py: 3 }}>
                                                Nenhuma senha cadastrada. Clique em Novo para
                                                começar.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>
            {selection && (
                <PasswordDialog
                    selection={selection}
                    onClose={() => setSelection(null)}
                    onSaved={() => {
                        setSelection(null)
                        setNotice(true)
                        void queryClient.invalidateQueries({ queryKey: ['passwords'] })
                    }}
                />
            )}
            <Snackbar open={notice} autoHideDuration={4000} onClose={() => setNotice(false)}>
                <Alert severity="success" onClose={() => setNotice(false)}>
                    Operação realizada com sucesso.
                </Alert>
            </Snackbar>
        </Stack>
    )
}
