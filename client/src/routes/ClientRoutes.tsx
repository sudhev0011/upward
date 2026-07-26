import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import ClientLayout from "@/layouts/ClientLayout";
import NotFound from "@/pages/public/NotFound";

const DashboardOverview = lazy(
  () => import("@/components/client/DashboardOverview"),
);
const BookingsPage = lazy(() => import("@/pages/client/BookingsPage"));
const MessagesPage = lazy(() => import("@/pages/client/MessagesPage"));
const PaymentsPage = lazy(() => import("@/pages/client/PaymentsPage"));
const ReviewsPage = lazy(() => import("@/pages/client/ReviewsPage"));
const SettingsPage = lazy(() => import("@/pages/client/SettingsPage"));

const ClientRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<ClientLayout />}>
        <Route index element={<DashboardOverview />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default ClientRoutes;
