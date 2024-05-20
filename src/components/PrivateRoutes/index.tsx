import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
const PrivateRoutes = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  useEffect(() => {
    console.log(isAuthenticated, 'protectedr', 'loading', isLoading);
  }, [isAuthenticated, isLoading, user]);
  if (!isAuthenticated && isLoading === false) return <Navigate to="/login" />;
  return <Outlet />;
};
export default PrivateRoutes;
