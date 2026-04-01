import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requireSeller?: boolean;
}

export function ProtectedRoute({ children, requireSeller = false }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireSeller && user?.role !== 'seller') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
