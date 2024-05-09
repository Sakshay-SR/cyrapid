import { Navigate, Outlet } from 'react-router-dom'
const PrivateRoutes = () => {
  const a = localStorage.getItem('auth')
  if (a !== undefined) {
    return a === 'true' ? <Outlet /> : <Navigate to="/login" />
  } else return <Navigate to="/login" />
}
export default PrivateRoutes
