import { Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/header/Navbar";
import Footer from "@/components/footer/Footer";

const ClientLayout = () => {
  const {pathname} = useLocation();
  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Navigation */}
      {pathname.includes('/client/dashboard') ? '' :  <Navbar />}

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      {pathname.includes('/client/dashboard') ? '' : <Footer />}
      {/* <Footer /> */}
    </div>
  );
};

export default ClientLayout;