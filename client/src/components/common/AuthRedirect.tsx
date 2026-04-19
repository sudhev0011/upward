import React from "react";
import { Navigate } from "react-router-dom";
import { UserRole } from "@/constants/user-role";
import { Loading } from "../ui/Loading";

import type { ReactNode } from "react";
import { useAppSelector } from "@/hooks/useRedux";
import type { RootState } from "@/store/store";

interface AuthRedirectProps {
  children: ReactNode;
}

const AuthRedirect: React.FC<AuthRedirectProps> = ({ children }) => {
  const { isAuthenticated, user, isAuthChecked, activeRole } = useAppSelector(
    (state: RootState) => state.auth,
  );

  if (!isAuthChecked) {
    console.log("hit the auth redirect");
    return <Loading />;
  }

  if (isAuthenticated && user?.roles) {
    // multiple roles but no role chosen yet
    // if (user.roles.length > 1 && !activeRole) {
    //   return <Navigate to="/select-role" replace />;
    // }

    const role = activeRole ?? user.roles[0];

    if (role === UserRole.ADMIN) {
      return <Navigate to="/admin" replace />;
    }

    if (role === UserRole.PROVIDER) {
      return <Navigate to="/provider/dashboard" replace />;
    }

    if (role === UserRole.CLIENT) {
      return <Navigate to="/client/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default AuthRedirect;
