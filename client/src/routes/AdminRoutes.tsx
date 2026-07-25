import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";
import NotFound from "@/pages/public/NotFound";

const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));
const Providers = lazy(() => import("@/pages/admin/Providers"));
const Clients = lazy(() => import("@/pages/admin/Clients"));
const Settings = lazy(() => import("@/pages/admin/Settings"));
const Categories = lazy(() => import("@/pages/admin/Categories"));
const Services = lazy(() => import("@/pages/admin/Services"));
const Subscriptions = lazy(() => import("@/pages/admin/Subscriptions"));
const Payments = lazy(() => import("@/pages/admin/Payments"));

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="providers" element={<Providers />} />
        <Route path="clients" element={<Clients />} />
        <Route path="settings" element={<Settings />} />
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