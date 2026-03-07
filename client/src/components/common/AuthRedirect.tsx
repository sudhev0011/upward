import React from 'react';
import { Navigate } from 'react-router-dom';
import { UserRole } from '@/constants/user-role';
import { Loading } from '../ui/Loading';

import type { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';

interface AuthRedirectProps {
  children: ReactNode;
}


const AuthRedirect: React.FC<AuthRedirectProps> = ({ children }) => {
  const {isAuthenticated, user,isAuthChecked } = useSelector((state: RootState)=> state.auth)

  if (!isAuthChecked) {
    console.log('hit the auth redirect')
    return <Loading />;
  }

  if (isAuthenticated && user?.role) {
    console.log('hit the second if clause at auth redirect')
    switch (user.role) {
      case UserRole.ADMIN:
        return <Navigate to="/admin/dashboard" replace />;
      case UserRole.PROVIDER:
        return <Navigate to="/company/dashboard" replace />;
      case UserRole.CLIENT:
        return <Navigate to="/client/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }
  return <>{children}</>;
};

export default AuthRedirect;