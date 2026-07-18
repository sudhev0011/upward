import { Route, Routes } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import Providers from "@/pages/admin/Providers";
import Clients from "@/pages/admin/Clients";
import Settings from "@/pages/admin/Settings";
import Categories from "@/pages/admin/Categories";
import Services from "@/pages/admin/Services";
import Subscriptions from "@/pages/admin/Subscriptions";
import Payments from "@/pages/admin/Payments";
import NotFound from "@/pages/public/NotFound";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="providers" element={<Providers />} />
        <Route path="clients" element={<Clients />} />
        <Route path="settings" element={<Settings />} />

        {/* Uncomment as you build each page */}
        <Route path="services" element={<Services />} />
        <Route path="categories" element={<Categories />} />
        <Route path="subscriptions" element={<Subscriptions />} />
        <Route path="payments" element={<Payments />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AdminRoutes;