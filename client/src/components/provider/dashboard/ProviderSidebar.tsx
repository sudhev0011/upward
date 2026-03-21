import {
  LayoutDashboard,
  User,
  Briefcase,
  DollarSign,
  Image,
  ShieldCheck,
  ShoppingCart,
  Wallet,
  CalendarDays,
  MessageSquare,
  Settings,
  LogOut,
  Zap,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const navItems = [
  { title: "Dashboard", url: "/provider/dashboard", icon: LayoutDashboard },
  { title: "Profile", url: "profile", icon: User },
  { title: "Services", url: "services", icon: Briefcase },
  { title: "Pricing", url: "pricing", icon: DollarSign },
  { title: "Portfolio", url: "portfolio", icon: Image },
  { title: "KYC & Bank", url: "kyc", icon: ShieldCheck },
  { title: "Orders", url: "orders", icon: ShoppingCart },
  { title: "Payouts", url: "payouts", icon: Wallet },
  { title: "Availability", url: "availability", icon: CalendarDays },
  { title: "Messages", url: "/provider/messages", icon: MessageSquare },
  { title: "Settings", url: "settings", icon: Settings },
];

export function ProviderSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/20">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent tracking-tight">
              ProVider
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end={item.url === "/provider"}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sidebar-foreground/80 transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-0.5"
                      activeClassName="bg-sidebar-accent text-primary font-semibold shadow-sm"
                    >
                      <item.icon className="h-[18px] w-[18px] shrink-0" />
                      {!collapsed && <span className="text-[13px]">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <Separator className="mb-3 opacity-50" />
        {!collapsed ? (
          <div className="space-y-3">
            <button
              onClick={() => toast.info("Logout clicked")}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => toast.info("Logout clicked")}
            className="flex w-full items-center justify-center rounded-xl p-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
