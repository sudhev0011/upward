import { Routes, Route } from "react-router-dom";
import { ProviderLayout } from "@/layouts/ProviderLayout";
import DashboardHome from "@/pages/provider/DashboardHome";
import ProfilePage from "@/pages/provider/ProfilePage";
import ServicesPage from "@/pages/provider/ServicesPage";
import PricingPage from "@/pages/provider/PricingPage";
import PortfolioPage from "@/pages/provider/PortfolioPage";
import KycPage from "@/pages/provider/KycPage";
import OrdersPage from "@/pages/provider/OrdersPage";
import PayoutsPage from "@/pages/provider/PayoutsPage";
import AvailabilityPage from "@/pages/provider/AvailabilityPage";
import MessagesPage from "@/pages/provider/MessagesPage";
import SettingsPage from "@/pages/provider/SettingsPage";

const ProviderRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<ProviderLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="portfolio" element={<PortfolioPage />} />
        <Route path="kyc" element={<KycPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="payouts" element={<PayoutsPage />} />
        <Route path="availability" element={<AvailabilityPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
};

export default ProviderRoutes;
