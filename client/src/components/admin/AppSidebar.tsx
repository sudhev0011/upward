import {
  LayoutDashboard,
  Users,
  UserCheck,
  Briefcase,
  FolderOpen,
  CreditCard,
  Crown,
  Settings,
  LogOut,
  ArrowUpRight,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useLogoutMutation } from "@/hooks/auth/useLogout";
import { useAppDispatch } from "@/hooks/useRedux";
import { logout } from "@/store/slices/authSlice";

const mainItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Providers", url: "/admin/providers", icon: UserCheck },
  { title: "Clients", url: "/admin/clients", icon: Users },
  { title: "Services", url: "/admin/services", icon: Briefcase },
  { title: "Categories", url: "/admin/categories", icon: FolderOpen },
  { title: "Subscriptions", url: "/admin/subscriptions", icon: Crown },
  { title: "Payments", url: "/admin/payments", icon: CreditCard },
];

// Reusable nav item — always mounted, text fades via CSS group-data attribute
function NavItem({
  url,
  icon: Icon,
  title,
  isActive,
  end = false,
}: {
  url: string;
  icon: React.ElementType;
  title: string;
  isActive: boolean;
  end?: boolean;
}) {
  return (
    <SidebarMenuItem>
      <Tooltip>
        <TooltipTrigger asChild>
          <SidebarMenuButton asChild isActive={isActive}>
            <NavLink
              to={url}
              end={end}
              className="flex items-center gap-3 w-full rounded-md px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
              activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
            >
              <Icon className="h-4 w-4 shrink-0" />
              {/* span is always in the DOM — sidebar CSS vars handle the width/opacity transition */}
              <span className="truncate">{title}</span>
            </NavLink>
          </SidebarMenuButton>
        </TooltipTrigger>
        {/* TooltipContent only visible when sidebar is collapsed (pointer-events handled by shadcn) */}
        <TooltipContent
          side="right"
          className="group-data-[state=expanded]:hidden"
        >
          {title}
        </TooltipContent>
      </Tooltip>
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { mutate: logoutMutation } =
    useLogoutMutation();
  const dispatch = useAppDispatch();

  const isActive = (url: string) =>
    url === "/admin"
      ? location.pathname === "/admin" || location.pathname === "/admin/"
      : location.pathname.startsWith(url);

  const handleLogout = async () => {
    logoutMutation(undefined, {
      onSuccess: (res) => {
        toast.info(res?.message)
        dispatch(logout());
        navigate("/login/admin");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Sidebar collapsible="icon">
        {/* ── Header — h-14 aligns with top bar ── */}
        <SidebarHeader className="h-14 flex flex-row items-center border-b border-sidebar-border px-3 gap-3 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold text-sm">
            <ArrowUpRight className="h-4 w-4 text-white" />
          </div>
          {/* Always mounted — overflow hidden on parent clips it when collapsed */}
          <div className="flex flex-col min-w-0 overflow-hidden transition-all duration-200">
            <span className="text-sm font-semibold text-sidebar-foreground leading-tight truncate">
              Upward
            </span>
            <span className="text-[11px] text-muted-foreground leading-tight truncate">
              Admin Panel
            </span>
          </div>
        </SidebarHeader>

        {/* ── Nav ── */}
        <SidebarContent className="py-2">
          <SidebarGroup>
            <SidebarGroupLabel className="px-4 text-[11px] uppercase tracking-wider font-medium text-muted-foreground mb-1 overflow-hidden transition-all duration-200">
              Management
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainItems.map((item) => (
                  <NavItem
                    key={item.title}
                    url={item.url}
                    icon={item.icon}
                    title={item.title}
                    isActive={isActive(item.url)}
                    end={item.url === "/admin"}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* ── Footer ── */}
        <SidebarFooter className="border-t border-sidebar-border py-2">
          <SidebarMenu>
            {/* Settings */}
            <NavItem
              url="/admin/settings"
              icon={Settings}
              title="Settings"
              isActive={isActive("/admin/settings")}
            />

            {/* Logout */}
            <SidebarMenuItem>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton
                    className="flex items-center gap-3 w-full rounded-md px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 shrink-0" />
                    <span className="truncate">Logout</span>
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="group-data-[state=expanded]:hidden"
                >
                  Logout
                </TooltipContent>
              </Tooltip>
            </SidebarMenuItem>
          </SidebarMenu>

          {/* Admin info — always mounted, clipped by overflow-hidden when collapsed */}
          <div
            className="overflow-hidden transition-all duration-200"
            style={{
              maxHeight: collapsed ? 0 : "4rem",
              opacity: collapsed ? 0 : 1,
            }}
          >
            <Separator className="my-2 bg-sidebar-border" />
            <div className="flex items-center gap-3 px-3 py-1">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                  AD
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-sidebar-foreground truncate">
                  Admin User
                </span>
                <span className="text-[10px] text-muted-foreground truncate">
                  admin@multiserv.com
                </span>
              </div>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  );
}
