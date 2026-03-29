import { SidebarProvider } from "@/components/ui/sidebar";
import { ProviderSidebar } from "@/components/provider/dashboard/ProviderSidebar";
import { ProviderHeader } from "@/components/provider/dashboard/ProviderHeader";
import { Outlet } from "react-router-dom";

export function ProviderLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <ProviderSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <ProviderHeader />

          <main className="flex-1 p-6 overflow-auto bg-secondary/20">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}