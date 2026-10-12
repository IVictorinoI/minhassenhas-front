import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    TextField,
    Typography,
} from '@mui/material'
import Close from '@mui/icons-material/Close'
import { api, errorMessage, readSecret, type PasswordRecord, type PasswordValues } from '../lib/api'
export type DialogSelection =
    { mode: 'create' } | { mode: 'update' | 'delete'; record: PasswordRecord }
interface Props {
    selection: DialogSelection
    onClose: () => void
    onSaved: () => void
}
export default function PasswordDialog({ selection, onClose, onSaved }: Props) {
    const editing = selection.mode === 'update'
    const deleting = selection.mode === 'delete'
    const record = 'record' in selection ? selection.record : undefined
    const [changing, setChanging] = useState(false)
    const [revealed, setRevealed] = useState<string | null>(null)
    const [error, setError] = useState('')
    const [notice, setNotice] = useState('')
    const [reading, setReading] = useState(false)
    const request = useRef<AbortController | null>(null)
    const mounted = useRef(true)
    const saving = useRef(false)
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<PasswordValues>({
        defaultValues: {
            description: record?.description || '',
            login: record?.login || '',
            url: record?.url || '',
            password: '',
        },
    })
    useEffect(
        () => () => {
            mounted.current = false
            request.current?.abort()
        },
        []
    )
    useEffect(() => {
        if (revealed === null) return
        const timeout = window.setTimeout(() => setRevealed(null), 30000)
        return () => clearTimeout(timeout)
    }, [revealed])
    const showSecret = async (copy: boolean) => {
        if (!record || reading) return
        request.current?.abort()
        const controller = new AbortController()
        request.current = controller
        setReading(true)
        setError('')
        setNotice('')
        try {
            const secret = await readSecret(record._id, controller.signal)
            if (controller.signal.aborted || !mounted.current) return
            if (copy) {
                await navigator.clipboard.writeText(secret)
                if (mounted.current) setNotice('Senha copiada.')
            } else setRevealed(secret)
        } catch (failure) {
            if (!controller.signal.aborted && mounted.current) setError(errorMessage(failure))
        } finally {
            if (mounted.current && !controller.signal.aborted) setReading(false)
        }
    }
    const submit = async (values: PasswordValues) => {
        if (saving.current) return
        saving.current = true
        setError('')
        const controller = new AbortController()
        request.current?.abort()
        request.current = controller
        const data: PasswordValues = {
            description: values.description,
            login: values.login,
            url: values.url,
        }
        if (selection.mode === 'create' || (editing && changing)) data.password = values.password
        try {
            await api.request({
                method: deleting ? 'DELETE' : editing ? 'PUT' : 'POST',
                url: '/api/passwords/' + (record?._id || ''),
                data,
                signal: controller.signal,
            })
            if (mounted.current && !controller.signal.aborted) onSaved()
        } catch (failure) {
            if (mounted.current && !controller.signal.aborted) setError(errorMessage(failure))
        } finally {
            saving.current = false
        }
    }
    const close = () => {
        if (!saving.current) onClose()
    }
    return (
        <Dialog
            open
            onClose={close}
            fullWidth
            maxWidth="sm"
            aria-labelledby="password-dialog-title"
        >
            <DialogTitle id="password-dialog-title" sx={{ pr: 7 }}>
                {deleting ? 'Excluir senha' : editing ? 'Editar senha' : 'Nova senha'}
                <IconButton
                    aria-label="Fechar"
                    onClick={close}
                    disabled={isSubmitting}
                    sx={{ position: 'absolute', right: 12, top: 12 }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            <form onSubmit={handleSubmit(submit)} autoComplete="off">
                <DialogContent dividers>
                    <Stack spacing={2.5}>
                        {deleting && (
                            <Alert severity="warning">
                                Confirme a exclusão desta conta. Esta ação não pode ser desfeita.
                            </Alert>
                        )}
                        {error && <Alert severity="error">{error}</Alert>}
                        {notice && <Alert severity="success">{notice}</Alert>}
                        <TextField
                            autoFocus
                            label="Descrição"
                            placeholder="Informe a descrição"
                            {...register('description', {
                                required: 'Informe a descrição.',
                                validate: (value) => !!value.trim() || 'Informe a descrição.',
                            })}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                            slotProps={{ htmlInput: { readOnly: deleting } }}
                        />
                        <TextField
                            label="Login / e-mail"
                            placeholder="Informe o login/e-mail"
                            {...register('login')}
                            slotProps={{ htmlInput: { readOnly: deleting } }}
                        />
                        <TextField
                            label="URL"
                            placeholder="Informe a URL"
                            {...register('url')}
                            slotProps={{ htmlInput: { readOnly: deleting } }}
                        />
                        {editing && (
                            <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
                                <Button
                                    variant="outlined"
                                    disabled={reading || isSubmitting}
                                    onClick={() => void showSecret(false)}
                                >
                                    Ver senha
                                </Button>
                                <Button
                                    variant="outlined"
                                    disabled={reading || isSubmitting}
                                    onClick={() => {
                                        setChanging(true)
                                        setRevealed(null)
                                    }}
                                >
                                    Alterar senha
                                </Button>
                                <Button
                                    variant="outlined"
                                    disabled={reading || isSubmitting}
                                    onClick={() => void showSecret(true)}
                                >
                                    Copiar senha
                                </Button>
                            </Stack>
                        )}
                        {((!editing && !deleting) || changing) && (
                            <TextField
                                label="Senha"
                                placeholder="Informe a senha"
                                type="password"
                                autoComplete="new-password"
                                {...register('password', {
                                    required: !deleting && 'Informe a senha.',
                                })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                        )}
                        {revealed !== null && (
                            <Alert severity="info">
                                <Typography sx={{ overflowWrap: 'anywhere' }}>
                                    {revealed}
                                </Typography>
                                <Button onClick={() => setRevealed(null)}>Ocultar senha</Button>
                            </Alert>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={close} disabled={isSubmitting}>
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color={deleting ? 'error' : 'primary'}
                        disabled={isSubmitting || reading}
                    >
                        {isSubmitting
                            ? 'Aguarde…'
                            : deleting
                              ? 'Excluir'
                              : editing
                                ? 'Alterar'
                                : 'Incluir'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}
