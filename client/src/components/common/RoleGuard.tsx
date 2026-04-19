import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "@/store/store";
import type {  ReactNode } from "react";
import { UserRole } from "@/constants/user-role";

export const RoleGuard = ({ children }: { children: ReactNode }) => {
  const { activeRole, user } = useSelector((state: RootState) => state.auth);

  // If user logged in but role not selected → force select-role
  if (user && !activeRole) {
    return <Navigate to="/select-role" replace />;
  }

  if(activeRole === UserRole.ADMIN){
    return <Navigate to="/admin" replace />
  }

  return children;
};