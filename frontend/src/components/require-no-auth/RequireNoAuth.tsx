import React from 'react'
import { Navigate } from 'react-router-dom';

const RequireNoAuth = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem('token');

    if (token) {
        return <Navigate to='/main' replace />
    }

    return <>{children}</>
}

export default RequireNoAuth
