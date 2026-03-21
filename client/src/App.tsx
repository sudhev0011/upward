import { Routes, Route } from "react-router-dom";
import ClientRoutes from "./routes/ClientRoutes";
import ProviderRoutes from "./routes/ProviderRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import AutoScroller from "./components/AutoScroller";
import PublicRoutes from "./routes/PublicRoutes";
import SelectRole from "./components/common/SelectRole";
import { RoleGuard } from "./components/common/RoleGuard";
const App = () => {
  return (
    <>
      <AutoScroller />
      <Routes>
        <Route path="/client/*" element={ <RoleGuard> <ClientRoutes /> </RoleGuard>} />
        <Route path="/admin/*" element={ <RoleGuard><AdminRoutes /></RoleGuard>} />
        <Route path="/provider/*" element={ <RoleGuard><ProviderRoutes /></RoleGuard>} />
        <Route path="/*" element={<PublicRoutes />} />
        <Route path="/select-role" element={<SelectRole />} />
      </Routes>
    </>
  );
};

export default App;
