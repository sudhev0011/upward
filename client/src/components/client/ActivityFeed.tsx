import { ArrowRight } from "lucide-react";

export interface Activity {
  id: string;
  type: "booking" | "message" | "review" | "payment" | "match";
  text: string;
  time: string;
  icon: string;
}

export const ACTIVITY: Activity[] = [
  { id: "a1", type: "booking",  text: "Home Deep Cleaning confirmed for Mar 11",         time: "2h ago",   icon: "📋" },
  { id: "a2", type: "message",  text: "New message from Luca T. on your React project",  time: "4h ago",   icon: "💬" },
  { id: "a3", type: "match",    text: "3 new pros matched for Plumbing Repair",          time: "Yesterday", icon: "✨" },
  { id: "a4", type: "payment",  text: "Payment of $420 processed for Logo Design",       time: "Feb 28",   icon: "💳" },
  { id: "a5", type: "review",   text: "You rated Tom R. ★★★★ for Electrical work",       time: "Feb 21",   icon: "⭐" },
  { id: "a6", type: "booking",  text: "Dedicated Dev Squad renewed for March",           time: "Mar 1",    icon: "🔄" },
];
export const ActivityFeed = () => (
  <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
      <div>
        <h2 className="text-base font-bold text-gray-900">Recent Activity</h2>
        <p className="text-xs text-gray-400 mt-0.5">Your latest updates</p>
      </div>
    </div>

    <ul className="divide-y divide-gray-50">
      {ACTIVITY.map((a) => (
        <li
          key={a.id}
          className="flex items-start gap-3.5 px-6 py-3.5 hover:bg-gray-50/60 transition-colors group cursor-pointer"
        >
          {/* Icon bubble */}
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[#EAF2F9] text-base mt-0.5">
            {a.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-700 leading-snug">{a.text}</p>
            <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
          </div>
          <ArrowRight className="h-3.5 w-3.5 text-gray-300 flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 group-hover:text-[#719FC4] transition-all" />
        </li>
      ))}
    </ul>

    <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50">
      <button className="flex items-center gap-1 text-xs font-semibold text-[#719FC4] hover:text-[#5585A8] transition-colors">
        View full history <ArrowRight className="h-3 w-3" />
      </button>
    </div>
  </div>
);