import { Navigate, Outlet } from 'react-router-dom'
import useAuth from "./useAuth"

export default function usePrivate() {
    const auth = useAuth()

    const PrivateRoute = () => {
        return auth ? <Outlet /> : <Navigate to='/' replace />
    }

    const withPermissions = () => {
        return true
    }

    return {
        PrivateRoute,
        withPermissions
    }
}