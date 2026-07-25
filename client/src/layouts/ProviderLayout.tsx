import { Suspense } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ProviderSidebar } from "@/components/provider/dashboard/ProviderSidebar";
import { ProviderHeader } from "@/components/provider/dashboard/ProviderHeader";
import { Outlet } from "react-router-dom";
import { Loading } from "@/components/ui/Loading";


export function ProviderLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <ProviderSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <ProviderHeader />

          <main className="flex-1 p-6 overflow-auto bg-secondary/20">
            <Suspense
              fallback={<Loading variant="inline" message="Loading page..." />}
            >
              <Outlet />
            </Suspense>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
