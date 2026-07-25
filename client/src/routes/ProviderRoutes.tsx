import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { ProviderLayout } from "@/layouts/ProviderLayout";
import NotFound from "@/pages/public/NotFound";

const DashboardHome = lazy(() => import("@/pages/provider/DashboardHome"));
const ProfilePage = lazy(() => import("@/pages/provider/ProfilePage"));
const ServicesPage = lazy(() => import("@/pages/provider/ServicesPage"));
const PricingPage = lazy(() => import("@/pages/provider/PricingPage"));
const PortfolioPage = lazy(() => import("@/pages/provider/PortfolioPage"));
const KycPage = lazy(() => import("@/pages/provider/KycPage"));
const OrdersPage = lazy(() => import("@/pages/provider/OrdersPage"));
const PayoutsPage = lazy(() => import("@/pages/provider/PayoutsPage"));
const AvailabilityPage = lazy(() => import("@/pages/provider/AvailabilityPage"));
const MessagesPage = lazy(() => import("@/pages/provider/MessagesPage"));
const SettingsPage = lazy(() => import("@/pages/provider/SettingsPage"));
const SubscriptionsPage = lazy(() => import("@/pages/provider/SubscriptionsPage"));

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
        <Route path="subscriptions" element={<SubscriptionsPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default ProviderRoutes;