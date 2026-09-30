import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm">Authenticating...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = (user.role || 'EMPLOYEE').toUpperCase();

  // If specific roles are required, strictly check them
  if (allowedRoles.length > 0) {
    const effectiveRoles = allowedRoles.map((r) => r.toUpperCase());
    const hasAccess = effectiveRoles.includes(userRole);

    if (!hasAccess) {
      if (userRole === 'ADMIN') return <Navigate to="/admin" replace />;
      if (userRole === 'AGENT') return <Navigate to="/agent" replace />;
      return <Navigate to="/employee" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
