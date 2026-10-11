import { toast } from 'react-toastify'
export const toastr = {
    error: (title, message) => toast.error(title + ': ' + message),
    success: (title, message) => toast.success(title + ': ' + message)
}
export function notifyError(error) {
    const errors = error.response?.data?.errors
    const messages = Array.isArray(errors) ? errors : ['Não foi possível concluir a operação. Verifique a conexão e tente novamente.']
    messages.forEach(message => toastr.error('Erro', message))
}

