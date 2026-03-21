import { useState } from "react";
import { Bell, Search, Menu, X } from "lucide-react";
import { useAppSelector } from "@/hooks/useRedux";
import type { RootState } from "@/store/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TopbarProps {
  onMenuToggle: () => void;
  sidebarOpen: boolean;
}

const NOTIFICATIONS = [
  {
    id: 1,
    text: "Sarah M. confirmed your booking for Mar 11",
    time: "2h ago",
    unread: true,
  },
  { id: 2, text: "New message from Luca T.", time: "4h ago", unread: true },
  {
    id: 3,
    text: "Your review for Tom R. was published",
    time: "Feb 21",
    unread: false,
  },
];

export const Topbar = ({ onMenuToggle, sidebarOpen }: TopbarProps) => {
  const [showNotifs, setShowNotifs] = useState(false);
  const [search, setSearch] = useState("");
  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;
  const { user } = useAppSelector((state: RootState) => state.auth);
  const avatarUrl = user?.avatar ? user?.avatar : "";
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
                <span className="rounded-full bg-[#EAF2F9] px-2 py-0.5 text-xs font-semibold text-[#5585A8]">
                  {unreadCount} new
                </span>
              </div>
              {NOTIFICATIONS.map((n) => (
                <div
                  key={n.id}
                  className={`flex gap-3 px-4 py-3 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors ${n.unread ? "bg-[#EAF2F9]/40" : ""}`}
                >
                  {n.unread && (
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#719FC4]" />
                  )}
                  {!n.unread && (
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0" />
                  )}
                  <div>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      {n.text}
                    </p>
                    <p className="mt-0.5 text-[11px] text-gray-400">{n.time}</p>
                  </div>
                </div>
              ))}
              <div className="px-4 py-2.5">
                <button className="w-full text-center text-xs font-semibold text-[#719FC4] hover:text-[#5585A8] transition-colors">
                  View all notifications
                </button>
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
