import { lazy, Suspense, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import AutoScroller from "./components/AutoScroller";
import SelectRole from "./components/common/SelectRole";
import { RoleGuard } from "./components/common/RoleGuard";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { UserRole } from "./constants/user-role";
import { useAppSelector } from "./hooks/useRedux";
import { RootState } from "./store/store";
import { useFcmToken } from "./hooks/useFcmToken";
import { prefetchPublicRoutes } from "./utils/RoutePrefetch";
import { Loading } from "./components/ui/Loading";

const ClientRoutes = lazy(() => import("./routes/ClientRoutes"));
const ProviderRoutes = lazy(() => import("./routes/ProviderRoutes"));
const AdminRoutes = lazy(() => import("./routes/AdminRoutes"));
const PublicRoutes = lazy(() => import("./routes/PublicRoutes"));


const App = () => {
  const { isAuthenticated } = useAppSelector((state: RootState) => state.auth);

  useFcmToken(isAuthenticated);

  useEffect(() => {
    prefetchPublicRoutes();
  }, []);

  return (
    <>
      <AutoScroller />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route
            path="/client/*"
            element={
              <RoleGuard>
                <ProtectedRoute allowedRoles={[UserRole.CLIENT]}>
                  <ClientRoutes />
                </ProtectedRoute>
              </RoleGuard>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN]} redirectTo={"/login/admin"}>
                <AdminRoutes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/provider/*"
            element={
              <RoleGuard>
                <ProtectedRoute allowedRoles={[UserRole.PROVIDER]}>
                  <ProviderRoutes />
                </ProtectedRoute>
              </RoleGuard>
            }
          />
          <Route path="/*" element={<PublicRoutes />} />
          <Route path="/select-role" element={<SelectRole />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;