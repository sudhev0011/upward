import { Routes, Route } from "react-router-dom";
import ClientLayout from "@/layouts/ClientLayout";

import { DashboardOverview } from "@/components/client/DashboardOverview";
import BookingsPage  from "@/pages/client/BookingsPage";
import MessagesPage  from "@/pages/client/MessagesPage";
import PaymentsPage  from "@/pages/client/PaymentsPage";
import ReviewsPage   from "@/pages/client/ReviewsPage";
import SettingsPage  from "@/pages/client/SettingsPage";
import NotFound from "@/pages/public/NotFound";

const ClientRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<ClientLayout />}>
        <Route index            element={<DashboardOverview />} />
        <Route path="bookings"  element={<BookingsPage />}      />
        <Route path="messages"  element={<MessagesPage />}      />
        <Route path="payments"  element={<PaymentsPage />}      />
        <Route path="reviews"   element={<ReviewsPage />}       />
        <Route path="settings"  element={<SettingsPage />}      />
        <Route path="*"         element={<NotFound />}          />
      </Route>
      <Route path="*"           element={<NotFound />}          />
    </Routes>
  );
};

export default ClientRoutes;