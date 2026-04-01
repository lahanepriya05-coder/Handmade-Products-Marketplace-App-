import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ROUTES } from '@/config/routes';

/**
 * ProtectedRoute - Route guard component for authenticated-only pages
 * 
 * Features:
 * - Checks if user is authenticated
 * - Redirects to login if not authenticated
 * - Preserves original location for redirect after login
 * - Shows loading state while checking auth
 * 
 * Usage:
 * <ProtectedRoute isAuthenticated={isAuth} isLoading={loading}>
 *   <Profile />
 * </ProtectedRoute>
 */
interface ProtectedRouteProps {
  isAuthenticated: boolean;
  isLoading?: boolean;
  children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isAuthenticated,
  isLoading = false,
  children,
}) => {
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated, preserving the original location
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
