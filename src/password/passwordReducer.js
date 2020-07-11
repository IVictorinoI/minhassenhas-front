const INITIAL_STATE = {list: [], currentPassword: {}, currentPasswordCopy: {}, isChangingPassword: false}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
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