import axios from 'axios'
import { toastr } from 'react-redux-toastr'
import { initialize } from 'redux-form'
import { showTabs, selectTab } from '../common/tab/tabActions'
import { copyToClipboard } from '../common/util/util'

const INITIAL_VALUES = {  }

export function getList() {
    const request = axios.get(`${window.Params.URL_API}/passwords/myPasswords?sort=-_id`)
    return {
        type: 'PASSWORDS_FETCHED',
        payload: request
    }
}

export function seePassword(_id) {
    const request = axios.get(`${window.Params.URL_API}/passwords/viewPassword?_id=${_id}`)
    return {
        type: 'PASSWORD_VIEW',
        payload: request
    }
    
}

export function copyPasswordToClipboard(_id) {
    return dispatch => {
        axios.get(`${window.Params.URL_API}/passwords/viewPassword?_id=${_id}`)
        .then(resp => {
            copyToClipboard(resp.data.password)
            toastr.success('Sucesso', 'Senha copiada.')
            dispatch({
                type: 'PASSWORD_COPY',
                payload: resp
            })
        })
        .catch(e => {
            e.response.data.errors.forEach(error => toastr.error('Erro', error))
        })
    }
}

export function changePassword(value) {
    return {
        type: 'CHANGE_PASSWORD',
        payload: value
    }
}

export function create(values) {
    return submit(values, 'post')
}

export function update(values) {
    return submit(values, 'put')
}

export function remove(values) {
    return submit(values, 'delete')
}

function submit(values, method) {
    return dispatch => {
        const id = values._id ? values._id : ''
        axios[method](`${window.Params.URL_API}/passwords/${id}`, values)
            .then(resp => {
                toastr.success('Sucesso', 'Operação Realizada com sucesso.')
                dispatch(init())
            })
            .catch(e => {
                e.response.data.errors.forEach(error => toastr.error('Erro', error))
            })
    }
}

export function showUpdate(password) {
    return [ 
        showTabs('tabUpdate'),
        selectTab('tabUpdate'),
        initialize('passwordForm', password)
    ]
}

export function showDelete(password) {
    return [ 
        showTabs('tabDelete'),
        selectTab('tabDelete'),
        initialize('passwordForm', password)
    ]
}

export function init() {
    return [
        showTabs('tabList', 'tabCreate'),
        selectTab('tabList'),
        getList(),
        initialize('passwordForm', INITIAL_VALUES),
        changePassword(false)
    ]
}