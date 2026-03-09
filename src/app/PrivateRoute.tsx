import { Navigate, Outlet } from 'react-router-dom'
import { getAccessToken } from 'shared/lib/tokenStorage'

export function PrivateRoute() {
  const isAuthenticated = Boolean(getAccessToken())

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}
