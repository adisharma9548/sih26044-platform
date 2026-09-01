import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const PrivateRoute: React.FC<{ allowedRoles?: string[]; redirectTo?: string }> =
  ({ allowedRoles = [], redirectTo = '/login' }) => {
    const { isAuthenticated, user } = useAuth();
    if (!isAuthenticated) return <Navigate to={redirectTo} replace />;
    if (allowedRoles.length && user && !allowedRoles.includes(user.role)) {
      return <Navigate to={`/${user.role}/dashboard`} replace />;
    }
    return <Outlet />;
  };