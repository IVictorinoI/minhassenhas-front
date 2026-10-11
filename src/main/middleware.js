import { notifyError } from '../common/msg/notify'

// Preserve array actions and promise payloads with Redux 5.
export const multi = ({ dispatch }) => next => action =>
    Array.isArray(action) ? action.map(dispatch) : next(action)

export const promise = ({ dispatch }) => next => action => {
    if (!action.payload || typeof action.payload.then !== 'function') return next(action)
    return action.payload.then(
        payload => dispatch({ ...action, payload }),
        error => {
            notifyError(error)
            return dispatch({ ...action, payload: error, error: true })
        }
    )
}

