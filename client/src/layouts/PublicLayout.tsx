import { Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/header/Navbar";
import Footer from "@/components/footer/Footer";

const PublicLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PublicLayout;