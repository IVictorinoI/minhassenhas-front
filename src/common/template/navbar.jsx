import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../auth/authActions'
export default function Navbar() {
    const user = useSelector(state => state.auth.user)
    const dispatch = useDispatch()
    return <div className="d-flex align-items-center gap-3 ms-auto">
        <span>{user.name || user.nome || user.email}</span>
        <button type="button" className="btn btn-outline-secondary" onClick={() => dispatch(logout())}>Sair</button>
    </div>
}
