import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useRedux';
import { UserRole } from '@/constants/user-role';
import { Loading } from '@/components/ui/Loading';
export interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [], 
  redirectTo = '/login' 
}) => {
  const { isAuthenticated, activeRole,isAuthChecked } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && activeRole && !allowedRoles.includes(activeRole)) {
    switch (activeRole) {
      case UserRole.ADMIN:
        return <Navigate to="/admin" replace />;
      case UserRole.CLIENT:
        return <Navigate to="/client/dashboard" replace />;
      case UserRole.PROVIDER:
        return <Navigate to="/provider/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;