import { Routes, Route } from "react-router-dom";
import ClientRoutes from "./routes/ClientRoutes";
import ProviderRoutes from "./routes/ProviderRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import AutoScroller from "./components/AutoScroller";
import PublicRoutes from "./routes/PublicRoutes";
import SelectRole from "./components/common/SelectRole";
import { RoleGuard } from "./components/common/RoleGuard";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { UserRole } from "./constants/user-role";
const App = () => {
  return (
    <>
      <AutoScroller />
      <Routes>
        <Route
          path="/client/*"
          element={
            <RoleGuard>
              {" "}
              <ProtectedRoute allowedRoles={[UserRole.CLIENT]}>
                <ClientRoutes />
              </ProtectedRoute>{" "}
            </RoleGuard>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              {" "}
              <AdminRoutes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/*"
          element={
            <RoleGuard>
              {" "}
              <ProtectedRoute allowedRoles={[UserRole.PROVIDER]}>
                {" "}
                <ProviderRoutes />{" "}
              </ProtectedRoute>{" "}
            </RoleGuard>
          }
        />
        <Route path="/*" element={<PublicRoutes />} />
        <Route path="/select-role" element={<SelectRole />} />
      </Routes>
    </>
  );
};

export default App;
