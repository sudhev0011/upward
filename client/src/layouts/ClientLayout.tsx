import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar as DashSidebar } from "@/components/client/SideBar";
import { Topbar } from "@/components/client/TopBar";

/**
 * DashboardLayout
 * Usage in your router:
 *
 *   <Route path="/dashboard" element={<DashboardLayout />}>
 *     <Route index element={<DashboardOverview />} />
 *     <Route path="bookings"  element={<BookingsPage />} />
 *     <Route path="messages"  element={<MessagesPage />} />
 *     <Route path="explore"   element={<ExplorePage />} />
 *     <Route path="saved"     element={<SavedPage />} />
 *     <Route path="payments"  element={<PaymentsPage />} />
 *     <Route path="reviews"   element={<ReviewsPage />} />
 *     <Route path="settings"  element={<SettingsPage />} />
 *   </Route>
 */
const ClientLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50/60 font-sans">
      {/* ── Sidebar (desktop: always visible, mobile: overlay) ── */}
      {/* Desktop */}
      <div className="hidden md:flex flex-shrink-0">
        <DashSidebar />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 md:hidden">
            <DashSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}

      {/* ── Main area ── */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Topbar
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ClientLayout