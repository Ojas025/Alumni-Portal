// src/components/Auth/ProtectedRoute.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { RootState } from '@/store/Store';

export const ProtectedRoute: React.FC = () => {
  const { user, isFetched, loading } = useSelector((state: RootState) => state.user);
  const location = useLocation();

  if (loading || !isFetched) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
