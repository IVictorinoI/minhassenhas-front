const INITIAL_STATE = {list: [], currentPassword: {}, currentPasswordCopy: {}, isChangingPassword: false, selectedPassword: {}, formRevision: 0}

export default (state = INITIAL_STATE, action) => {
    if (action.error) return state
    switch (action.type) {
        case 'PASSWORD_SELECTED':
            return { ...state, selectedPassword: action.payload, formRevision: state.formRevision + 1 }
        case 'PASSWORDS_FETCHED':
            return { ...state, list: action.payload.data }
        case 'PASSWORD_VIEW':
            return { ...state, isChangingPassword: false, currentPassword: action.payload.data }
        case 'PASSWORD_COPY':
            return { ...state, currentPasswordCopy: action.payload.data }
        case 'CHANGE_PASSWORD':
            return { ...state, isChangingPassword: action.payload, currentPassword: {} }
        default:
            return state
    }
}
