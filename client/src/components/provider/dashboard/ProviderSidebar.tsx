import {
  LayoutDashboard, User, Briefcase, DollarSign, Image,
  ShieldCheck, ShoppingCart, Wallet, CalendarDays,
  MessageSquare, Settings, Zap, Crown
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar";


const mainNav = [
  { title: "Dashboard",    url: "/provider/dashboard", icon: LayoutDashboard },
  { title: "Profile",      url: "profile",             icon: User },
  { title: "Services",     url: "services",            icon: Briefcase },
  { title: "Pricing",      url: "pricing",             icon: DollarSign },
  { title: "Subscription", url: "subscriptions",       icon: Crown },
  { title: "Portfolio",    url: "portfolio",           icon: Image },
  { title: "KYC & Bank",   url: "kyc",                 icon: ShieldCheck },
];

const manageNav = [
  { title: "Orders",       url: "orders",              icon: ShoppingCart },
  { title: "Payouts",      url: "payouts",             icon: Wallet },
  { title: "Availability", url: "availability",        icon: CalendarDays },
  { title: "Messages",     url: "messages",  icon: MessageSquare },
  { title: "Settings",     url: "settings",            icon: Settings },
];

export function ProviderSidebar() {
  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border bg-sidebar-background"
    >
      {/* ── Brand ── */}
      <SidebarHeader className="h-16 px-4 flex items-center border-b border-sidebar-border">
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Icon mark */}
          <div className="h-9 w-9 shrink-0 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/25">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-[15px] font-extrabold text-sidebar-foreground leading-none tracking-tight">
              ProVider
            </span>
            <span className="text-[10px] font-semibold text-primary leading-none mt-0.5 tracking-wider uppercase">
              Dashboard
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* ── Nav ── */}
      <SidebarContent className="px-3 py-4 flex flex-col gap-5">

        {/* Main group */}
        <NavGroup items={mainNav} />

        {/* Manage group */}
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-sidebar-foreground/30 px-3 mb-2 group-data-[collapsible=icon]:hidden select-none">
            Manage
          </p>
          <NavGroup items={manageNav} />
        </div>

      </SidebarContent>

    </Sidebar>
  );
}

/* ── Nav group ── */
function NavGroup({ items }: { items: typeof mainNav }) {
  return (
    <SidebarGroup className="p-0">
      <SidebarGroupContent>
        <SidebarMenu className="space-y-0.5">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <NavLink
                  to={item.url}
                  end={item.url === "/provider/dashboard"}
                  className="flex items-center gap-3 rounded-xl h-10 px-3 text-[13px] font-semibold text-sidebar-foreground/70 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent transition-all duration-150"
                  activeClassName="bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                >
                  {/* Active indicator stripe */}
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-primary opacity-0 [.active_&]:opacity-100 transition-opacity" />
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}