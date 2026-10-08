import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { AppDataProvider } from '../context/AppDataContext'

/** Guards private pages and mounts the per-student data provider. */
export default function ProtectedRoute() {
  const { user } = useAuth()
  const location = useLocation()
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return (
    <AppDataProvider key={user.email}>
      <Outlet />
    </AppDataProvider>
  )
}
