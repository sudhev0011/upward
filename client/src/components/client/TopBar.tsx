import { useState } from "react";
import { Bell, Search, Menu, X, CheckCheck } from "lucide-react";
import { useAppSelector } from "@/hooks/useRedux";
import type { RootState } from "@/store/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import {
  useNotificationsQuery,
  useUnreadNotificationCountQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useNotificationSocketListener,
} from "@/hooks/notification/useNotifications";

interface TopbarProps {
  onMenuToggle: () => void;
  sidebarOpen: boolean;
}

export const Topbar = ({ onMenuToggle, sidebarOpen }: TopbarProps) => {
  const navigate = useNavigate();
  const [showNotifs, setShowNotifs] = useState(false);
  const [search, setSearch] = useState("");
  const { user } = useAppSelector((state: RootState) => state.auth);
  const avatarUrl = user?.avatar ? user?.avatar : "";

  // Connect websocket listener for notifications
  useNotificationSocketListener();

  const { data: notificationsRes } = useNotificationsQuery(1, 10);
  const { data: unreadCountRes } = useUnreadNotificationCountQuery();

  const markReadMutation = useMarkNotificationReadMutation();
  const markAllReadMutation = useMarkAllNotificationsReadMutation();

  const notifications = notificationsRes?.data?.data || [];
  const unreadCount = unreadCountRes?.data?.count || 0;

  const handleNotificationClick = async (notif: any) => {
    if (!notif.isRead) {
      markReadMutation.mutate(notif.id);
    }
    setShowNotifs(false);
    if (notif.type === "chat") {
      navigate("/client/dashboard/messages");
    } else if (notif.type === "booking") {
      navigate("/client/dashboard/bookings");
    }
  };

  const handleMarkAllRead = () => {
    markAllReadMutation.mutate();
  };

  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const diffMs = Date.now() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    } catch {
      return "";
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-100 bg-white/90 backdrop-blur-sm px-4 md:px-6">
      {/* Mobile menu toggle */}
      <button
        onClick={onMenuToggle}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors md:hidden"
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search services, pros…"
          className="h-9 w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#719FC4] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#719FC4]/20 transition-all"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#719FC4] text-[9px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {showNotifs && (
            <div className="absolute right-0 top-11 w-80 rounded-2xl border border-gray-100 bg-white shadow-xl shadow-gray-200/60 z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-bold text-gray-900">Notifications</p>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs text-[#719FC4] hover:text-[#5585A8] flex items-center gap-1 font-semibold transition-colors"
                      title="Mark all as read"
                    >
                      <CheckCheck className="h-3.5 w-3.5" />
                      Read All
                    </button>
                  )}
                  <span className="rounded-full bg-[#EAF2F9] px-2 py-0.5 text-xs font-semibold text-[#5585A8]">
                    {unreadCount} new
                  </span>
                </div>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className={`flex gap-3 px-4 py-3 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors ${!n.isRead ? "bg-[#EAF2F9]/40" : ""}`}
                  >
                    {!n.isRead && (
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#719FC4]" />
                    )}
                    {n.isRead && (
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0" />
                    )}
                    <div>
                      <p className={`text-xs leading-relaxed ${!n.isRead ? "font-bold text-gray-900" : "text-gray-700"}`}>
                        {n.title}
                      </p>
                      <p className="text-xs text-gray-500 leading-normal mt-0.5">
                        {n.message}
                      </p>
                      <p className="mt-0.5 text-[11px] text-gray-400">{formatTime(n.createdAt)}</p>
                    </div>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <div className="p-8 text-center text-xs text-gray-400">
                    No notifications yet
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <Avatar size="lg">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};
