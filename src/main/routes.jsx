import React from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router'
import AuthOrApp from './authOrApp'
import Dashboard from '../dashboard/dashboard'
import Password from '../password/password'

export default () => (
    <HashRouter>
        <AuthOrApp>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/passwords" element={<Password />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AuthOrApp>
    </HashRouter>
)
