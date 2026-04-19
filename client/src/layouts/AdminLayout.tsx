import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/AppSidebar";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const AdminLayout = () => {
  return (
    <SidebarProvider>
      {/* Sidebar sits here — it manages its own width via CSS vars */}
      <AppSidebar />

      {/* Main area grows to fill remaining space */}
      <div className="flex flex-1 flex-col min-w-0 min-h-screen">

        {/* Top bar — h-14 matches the SidebarHeader height so the divider lines up */}
        <header className="h-14 shrink-0 flex items-center justify-between border-b bg-card px-4 gap-3">
          <div className="flex items-center gap-3">
            {/* Trigger is INSIDE the main area, not inside the sidebar */}
            <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />
            <Separator orientation="vertical" className="h-5 hidden md:block" />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground hover:text-foreground"
            >
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                3
              </Badge>
            </Button>
            <Separator orientation="vertical" className="h-5" />
            <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-primary/20">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                AD
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-background p-6">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;