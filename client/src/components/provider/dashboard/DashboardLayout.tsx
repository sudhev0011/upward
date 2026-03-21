import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Outlet } from "react-router-dom";
import { Bell, LogOut, Settings, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function DashboardLayout() {
  const navigate = useNavigate();
  const [isAvailable, setIsAvailable] = useState(true);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 flex items-center gap-4 border-b border-border/50 bg-background/80 backdrop-blur-xl px-6 sticky top-0 z-10">
            <SidebarTrigger />
            <div className="flex-1" />
            <div className="flex items-center gap-3">
              {/* Availability Toggle */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary/30 border border-border/50">
                <span className={`h-2 w-2 rounded-full ${isAvailable ? "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]" : "bg-muted-foreground"} transition-colors`} />
                <span className="text-xs font-medium text-muted-foreground hidden sm:inline">
                  {isAvailable ? "Available" : "Unavailable"}
                </span>
                <Switch
                  checked={isAvailable}
                  onCheckedChange={(checked) => {
                    setIsAvailable(checked);
                    toast.success(checked ? "You are now available" : "You are now unavailable");
                  }}
                  className="scale-75"
                />
              </div>

              <Button variant="ghost" size="icon" className="relative rounded-xl text-muted-foreground hover:text-foreground">
                <Bell className="h-[18px] w-[18px]" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 rounded-xl px-2 py-1.5 hover:bg-secondary/50 transition-colors duration-200">
                    <div className="relative">
                      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-md shadow-primary/10">
                        <span className="text-xs font-bold text-primary-foreground">AR</span>
                      </div>
                      <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background ${isAvailable ? "bg-green-500" : "bg-muted-foreground"} transition-colors`} />
                    </div>
                    <div className="hidden sm:flex flex-col items-start">
                      <span className="text-sm font-semibold text-foreground">Alex Rivera</span>
                      <span className="text-xs text-muted-foreground">Provider</span>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl p-1.5">
                  <DropdownMenuLabel className="font-normal px-3 py-2">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-semibold">Alex Rivera</p>
                      <p className="text-xs text-muted-foreground">alex@example.com</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="rounded-lg px-3 py-2 cursor-pointer" onClick={() => navigate("/dashboard/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-lg px-3 py-2 cursor-pointer" onClick={() => navigate("/dashboard/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="rounded-lg px-3 py-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                    onClick={() => toast.info("Logout clicked")}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
