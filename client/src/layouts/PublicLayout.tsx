import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/header/Navbar";
import Footer from "@/components/footer/Footer";
import { Loading } from "@/components/ui/Loading";

const PublicLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        <Suspense fallback={<Loading variant="inline" message="Loading page..." />}>
          <Outlet />
        </Suspense>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PublicLayout;