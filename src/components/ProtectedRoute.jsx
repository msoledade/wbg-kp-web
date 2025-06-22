import React from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}; 