import { Route, Routes } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import Providers from "@/pages/admin/Providers";
import Clients from "@/pages/admin/Clients";
import Settings from "@/pages/admin/Settings";

// These pages don't exist yet — create them as stubs when ready
// import Services from "@/pages/admin/Services";
// import Categories from "@/pages/admin/Categories";
// import Subscriptions from "@/pages/admin/Subscriptions";
// import Payments from "@/pages/admin/Payments";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="providers" element={<Providers />} />
        <Route path="clients" element={<Clients />} />
        <Route path="settings" element={<Settings />} />

        {/* Uncomment as you build each page */}
        {/* <Route path="services" element={<Services />} /> */}
        {/* <Route path="categories" element={<Categories />} /> */}
        {/* <Route path="subscriptions" element={<Subscriptions />} /> */}
        {/* <Route path="payments" element={<Payments />} /> */}
      </Route>
    </Routes>
  );
};

export default AdminRoutes;