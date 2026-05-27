import { Routes, Route } from "react-router-dom";
import ClientLayout from "@/layouts/ClientLayout";

import { DashboardOverview } from "@/components/client/DashboardOverview";
import BookingsPage  from "@/pages/client/BookingsPage";
import MessagesPage  from "@/pages/client/MessagesPage";
import SavedPage     from "@/pages/client/SavedPage";
import PaymentsPage  from "@/pages/client/PaymentsPage";
import ReviewsPage   from "@/pages/client/ReviewsPage";
import SettingsPage  from "@/pages/client/SettingsPage";

/**
 * Mounted at /client/* in App.tsx
 *
 * Full URLs:
 *   /client/dashboard             → DashboardOverview
 *   /client/dashboard/bookings    → BookingsPage
 *   /client/dashboard/explore     → ExplorePage
 *   /client/dashboard/messages    → MessagesPage
 *   /client/dashboard/saved       → SavedPage
 *   /client/dashboard/payments    → PaymentsPage
 *   /client/dashboard/reviews     → ReviewsPage
 *   /client/dashboard/settings    → SettingsPage
 */
const ClientRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<ClientLayout />}>
        <Route index            element={<DashboardOverview />} />
        <Route path="bookings"  element={<BookingsPage />}      />
        <Route path="messages"  element={<MessagesPage />}      />
        <Route path="saved"     element={<SavedPage />}         />
        <Route path="payments"  element={<PaymentsPage />}      />
        <Route path="reviews"   element={<ReviewsPage />}       />
        <Route path="settings"  element={<SettingsPage />}      />
      </Route>
    </Routes>
  );
};

export default ClientRoutes;