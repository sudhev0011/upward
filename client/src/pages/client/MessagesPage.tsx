import { useState } from "react";
import { Search, Send, Paperclip } from "lucide-react";

const THREADS = [
  {
    id: "t1",
    name: "Sarah M.",
    initials: "SM",
    service: "Home Deep Cleaning",
    lastMsg: "See you on Tuesday at 10am!",
    time: "2h ago",
    unread: 2,
  },
  {
    id: "t2",
    name: "Luca T.",
    initials: "LT",
    service: "React Dashboard Dev",
    lastMsg: "I pushed the latest changes to repo",
    time: "4h ago",
    unread: 1,
  },
  {
    id: "t3",
    name: "Mike D.",
    initials: "MD",
    service: "Plumbing Repair",
    lastMsg: "Can we reschedule to Friday?",
    time: "Yesterday",
    unread: 0,
  },
  {
    id: "t4",
    name: "Priya K.",
    initials: "PK",
    service: "Logo & Brand Design",
    lastMsg: "Final files have been delivered!",
    time: "Feb 28",
    unread: 0,
  },
  {
    id: "t5",
    name: "Dev Squad",
    initials: "DS",
    service: "Full-Stack Team",
    lastMsg: "Sprint review is tomorrow at 3pm",
    time: "Mar 1",
    unread: 0,
  },
];

const MESSAGES: Record<
  string,
  { id: string; from: "me" | "them"; text: string; time: string }[]
> = {
  t1: [
    {
      id: "m1",
      from: "them",
      text: "Hi! Just confirming our booking for Tuesday.",
      time: "10:00 AM",
    },
    {
      id: "m2",
      from: "me",
      text: "Yes, 10am works perfectly. Thanks!",
      time: "10:05 AM",
    },
    {
      id: "m3",
      from: "them",
      text: "Great! I'll bring all the supplies needed.",
      time: "10:08 AM",
    },
    {
      id: "m4",
      from: "them",
      text: "See you on Tuesday at 10am!",
      time: "10:09 AM",
    },
  ],
  t2: [
    {
      id: "m1",
      from: "me",
      text: "Hey, how's progress on the dashboard?",
      time: "9:00 AM",
    },
    {
      id: "m2",
      from: "them",
      text: "Going well! Just finished the charts section.",
      time: "9:30 AM",
    },
    {
      id: "m3",
      from: "them",
      text: "I pushed the latest changes to repo",
      time: "9:35 AM",
    },
  ],
  t3: [
    {
      id: "m1",
      from: "them",
      text: "Hi, the part I need won't arrive until Thursday.",
      time: "2:00 PM",
    },
    {
      id: "m2",
      from: "them",
      text: "Can we reschedule to Friday?",
      time: "2:01 PM",
    },
    {
      id: "m3",
      from: "me",
      text: "Friday works. Let's say 9am?",
      time: "3:00 PM",
    },
  ],
  t4: [
    {
      id: "m1",
      from: "them",
      text: "All logo files are ready in the shared folder.",
      time: "11:00 AM",
    },
    {
      id: "m2",
      from: "them",
      text: "Final files have been delivered!",
      time: "11:02 AM",
    },
    {
      id: "m3",
      from: "me",
      text: "They look amazing, thank you so much!",
      time: "12:00 PM",
    },
  ],
  t5: [
    {
      id: "m1",
      from: "them",
      text: "We completed all the user auth stories this week.",
      time: "4:00 PM",
    },
    {
      id: "m2",
      from: "me",
      text: "Awesome, great pace everyone!",
      time: "4:05 PM",
    },
    {
      id: "m3",
      from: "them",
      text: "Sprint review is tomorrow at 3pm",
      time: "4:10 PM",
    },
  ],
};

const MessagesPage = () => {
  const [activeThread, setActiveThread] = useState("t1");
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");

  const thread = THREADS.find((t) => t.id === activeThread)!;
  const msgs = MESSAGES[activeThread] ?? [];
  const threads = THREADS.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.service.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSend = () => {
    if (!input.trim()) return;
    setInput("");
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden p-4 md:p-6 gap-4 max-w-[1400px] mx-auto">
      {/* Thread list */}
      <div className="w-72 shrink-0 flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h1 className="text-base font-bold text-gray-900 mb-3">Messages</h1>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations…"
              className="h-8 w-full rounded-lg border border-gray-200 bg-gray-50 pl-8 pr-3 text-xs placeholder:text-gray-400 focus:border-[#719FC4] focus:outline-none transition-all"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
          {threads.map((t) => (
            <div
              key={t.id}
              onClick={() => setActiveThread(t.id)}
              className={`flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-colors ${
                t.id === activeThread ? "bg-[#EAF2F9]" : "hover:bg-gray-50"
              }`}
            >
              <div className="relative shrink-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#719FC4] text-xs font-bold text-white">
                  {t.initials}
                </div>
                {t.unread > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#719FC4] text-[9px] font-bold text-white border-2 border-white">
                    {t.unread}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {t.name}
                  </p>
                  <p className="text-[10px] text-gray-400 shrink-0 ml-1">
                    {t.time}
                  </p>
                </div>
                <p className="text-[11px] text-[#5585A8] truncate">
                  {t.service}
                </p>
                <p className="text-xs text-gray-400 truncate mt-0.5">
                  {t.lastMsg}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden min-w-0">
        {/* Chat header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#719FC4] text-xs font-bold text-white">
            {thread.initials}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">{thread.name}</p>
            <p className="text-xs text-gray-400">{thread.service}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
          {msgs.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.from === "me"
                    ? "bg-[#719FC4] text-white rounded-br-sm"
                    : "bg-gray-100 text-gray-800 rounded-bl-sm"
                }`}
              >
                {m.text}
                <p
                  className={`text-[10px] mt-1 ${m.from === "me" ? "text-white/60 text-right" : "text-gray-400"}`}
                >
                  {m.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-2">
          <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
            <Paperclip className="h-4 w-4" />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message…"
            className="flex-1 h-10 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm placeholder:text-gray-400 focus:border-[#719FC4] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#719FC4]/20 transition-all"
          />
          <button
            onClick={handleSend}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#719FC4] hover:bg-[#5585A8] text-white transition-all shadow-sm hover:shadow-md"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
