import { Bell, LogOut, Settings, User, ShieldCheck, ShieldX, Loader2 } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useGetProfileQuery } from "@/hooks/provider/useGetProfile";
import { useLogoutMutation } from "@/hooks/auth/useLogout";
import { useAppDispatch } from "@/hooks/useRedux";
import { logout } from "@/store/slices/authSlice";

export function ProviderHeader() {
  const navigate = useNavigate();
  const { data: response, isLoading } = useGetProfileQuery();
  const { mutate: logoutMutation, isPending: isLoggingOut } = useLogoutMutation();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
      logoutMutation(undefined, {
        onSuccess: () => {
          dispatch(logout());
          navigate("/login");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      });
    };

  const profile = response?.data;

  const isApproved = profile?.isApprovedByAdmin ?? false;

  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AR";

  return (
    <header className="h-16 flex items-center gap-3 px-5 sticky top-0 z-20 bg-background border-b border-border">

      <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors rounded-lg" />

      <div className="flex-1" />

      {/* ── Admin Approval Indicator ── */}
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={`flex items-center gap-2 h-9 px-3 rounded-xl border transition-all duration-300 select-none cursor-default ${
                isLoading
                  ? "border-border bg-secondary/40"
                  : isApproved
                  ? "border-success/25 bg-success/8 text-success"
                  : "border-warning/25 bg-warning/8 text-warning"
              }`}
            >
              {isLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
              ) : isApproved ? (
                <ShieldCheck className="h-3.5 w-3.5" />
              ) : (
                <ShieldX className="h-3.5 w-3.5" />
              )}

              <span className="text-xs font-bold hidden sm:inline tracking-wide">
                {isLoading ? "Loading…" : isApproved ? "Approved" : "Pending Approval"}
              </span>

              {/* Pulse dot — only when approved */}
              {!isLoading && isApproved && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                </span>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            className="rounded-xl text-xs font-semibold px-3 py-1.5"
          >
            {isLoading
              ? "Fetching profile…"
              : isApproved
              ? "Your account has been approved by admin"
              : "Your account is awaiting admin approval"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* ── Notifications ── */}
      <button className="relative h-9 w-9 flex items-center justify-center rounded-xl border border-border bg-secondary/40 text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-200">
        <Bell className="h-4 w-4" />
        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
      </button>

      {/* ── Profile dropdown ── */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2.5 h-9 pl-1 pr-3 rounded-xl border border-border bg-secondary/40 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200">
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center shadow-sm shadow-primary/30">
              <span className="text-[10px] font-extrabold text-primary-foreground tracking-wide">
                {initials}
              </span>
            </div>
            <div className="hidden sm:flex flex-col items-start gap-px">
              <span className="text-[13px] font-bold text-foreground leading-none">
                {profile?.name ?? "Alex Rivera"}
              </span>
              <span className="text-[10px] font-semibold text-primary leading-none">Provider</span>
            </div>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="w-56 rounded-2xl border border-border bg-popover shadow-xl shadow-black/[0.08] p-2"
        >
          <DropdownMenuLabel className="px-3 py-2.5 rounded-xl bg-secondary/50 mb-1">
            <p className="text-sm font-bold text-foreground">{profile?.name ?? "Alex Rivera"}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{profile?.email ?? "alex@example.com"}</p>
            {/* Approval badge inside dropdown */}
            <div className={`inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide ${
              isApproved
                ? "bg-success/10 text-success"
                : "bg-warning/10 text-warning"
            }`}>
              {isApproved ? (
                <ShieldCheck className="h-3 w-3" />
              ) : (
                <ShieldX className="h-3 w-3" />
              )}
              {isApproved ? "Admin Approved" : "Pending Approval"}
            </div>
          </DropdownMenuLabel>

          <DropdownMenuItem
            className="rounded-xl px-3 py-2.5 text-[13px] font-semibold cursor-pointer text-foreground/80 hover:text-foreground focus:bg-accent gap-2.5"
            onClick={() => navigate("/provider/dashboard/profile")}
          >
            <User className="h-4 w-4 text-muted-foreground" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            className="rounded-xl px-3 py-2.5 text-[13px] font-semibold cursor-pointer text-foreground/80 hover:text-foreground focus:bg-accent gap-2.5"
            onClick={() => navigate("/provider/dashboard/settings")}
          >
            <Settings className="h-4 w-4 text-muted-foreground" />
            Settings
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1.5 bg-border" />

          <DropdownMenuItem
            className="rounded-xl px-3 py-2.5 text-[13px] font-semibold cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 gap-2.5 disabled:opacity-50"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <LogOut className="h-4 w-4" />
            }
            {isLoggingOut ? "Logging out…" : "Log out"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}