import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "@/store/store";
import type {  ReactNode } from "react";

export const RoleGuard = ({ children }: { children: ReactNode }) => {
  const { activeRole, user } = useSelector((state: RootState) => state.auth);

  // If user logged in but role not selected → force select-role
  if (user && !activeRole) {
    return <Navigate to="/select-role" replace />;
  }

  return children;
};