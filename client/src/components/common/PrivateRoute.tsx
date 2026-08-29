import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface PrivateRouteProps {
  allowedRoles?: string[];
  redirectTo?: string;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  allowedRoles = [],
  redirectTo = '/login',
}) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    // Redirect to a forbidden page or dashboard of their role
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return <Outlet />;
};