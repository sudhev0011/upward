import { useEffect, useState, useRef } from "react";
import { Search, Send, Paperclip } from "lucide-react";
import { useAppSelector } from "@/hooks/useRedux";
import { useSocket } from "@/hooks/useSocket";
import { chatApi } from "@/api/chat.api";
import { Conversation, Message } from "@/interfaces/chat.interface";

const MessagesPage = () => {
  const currentUser = useAppSelector((state) => state.auth.user);
  const currentUserId = currentUser?.id || "";

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeThread, setActiveThread] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Hook up Socket.IO connection
  const { socket } = useSocket(activeThread);

  // Fetch all conversations on mount
  const fetchConversations = async () => {
    try {
      const response = await chatApi.getConversations();
      if (response.success && response.data) {
        setConversations(response.data);
        // Automatically select the first conversation if none is active
        if (response.data.length > 0 && !activeThread) {
          setActiveThread(response.data[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Fetch messages for the active conversation
  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await chatApi.getMessages(conversationId);
      if (response.success && response.data) {
        setMessages(response.data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    if (activeThread) {
      fetchMessages(activeThread);

      // Reset unread count for client
      chatApi.resetUnreadCount(activeThread, "client").then(() => {
        // Emit read event to socket
        socket?.emit("read_messages", { conversationId: activeThread, role: "client" });
      });
    }
  }, [activeThread, socket]);

  // Set up socket listeners
  useEffect(() => {
    if (!socket) return;

    const handleMessageReceived = (message: Message) => {
      if (message.conversationId === activeThread) {
        setMessages((prev) => [...prev, message]);
        // Reset unread counts on server since we are active in this room
        chatApi.resetUnreadCount(activeThread, "client").then(() => {
          socket.emit("read_messages", { conversationId: activeThread, role: "client" });
        });
      }
    };

    const handleConversationUpdated = () => {
      fetchConversations();
    };

    socket.on("message_received", handleMessageReceived);
    socket.on("conversation_updated", handleConversationUpdated);

    return () => {
      socket.off("message_received", handleMessageReceived);
      socket.off("conversation_updated", handleConversationUpdated);
    };
  }, [socket, activeThread]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !activeThread || !socket) return;

    socket.emit(
      "send_message",
      {
        conversationId: activeThread,
        text: input.trim(),
      },
      (res: { success: boolean; error?: string }) => {
        if (!res.success) {
          console.error("Failed to send message:", res.error);
        }
      }
    );

    setInput("");
  };

  const getInitials = (name: string) => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "U";
  };

  const selectedThread = conversations.find((t) => t.id === activeThread);

  const filteredThreads = conversations.filter(
    (t) =>
      t.participant?.name.toLowerCase().includes(search.toLowerCase()) ||
      t.participant?.email.toLowerCase().includes(search.toLowerCase())
  );

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
          {filteredThreads.map((t) => {
            const hasUnread = t.unreadCountClient > 0;
            const participantName = t.participant?.name || "User";
            const initials = getInitials(participantName);

            return (
              <div
                key={t.id}
                onClick={() => setActiveThread(t.id)}
                className={`flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-colors ${
                  t.id === activeThread ? "bg-[#EAF2F9]" : "hover:bg-gray-50"
                }`}
              >
                <div className="relative shrink-0">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#719FC4] text-xs font-bold text-white">
                    {initials}
                  </div>
                  {hasUnread && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#719FC4] text-[9px] font-bold text-white border-2 border-white">
                      {t.unreadCountClient}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm truncate ${hasUnread ? "font-bold text-gray-900" : "font-semibold text-gray-700"}`}>
                      {participantName}
                    </p>
                    <p className="text-[10px] text-gray-400 shrink-0 ml-1">
                      {t.lastMessage ? new Date(t.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {t.lastMessage ? t.lastMessage.text : "No messages yet"}
                  </p>
                </div>
              </div>
            );
          })}
          {filteredThreads.length === 0 && (
            <div className="p-8 text-center text-xs text-gray-400">
              No conversations found
            </div>
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden min-w-0">
        {selectedThread ? (
          <>
            {/* Chat header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#719FC4] text-xs font-bold text-white">
                {getInitials(selectedThread.participant?.name || "")}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">
                  {selectedThread.participant?.name}
                </p>
                <p className="text-xs text-gray-400">
                  {selectedThread.participant?.email}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
              {messages.map((m) => {
                const isMe = m.senderId === currentUserId;
                return (
                  <div
                    key={m.id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        isMe
                          ? "bg-[#719FC4] text-white rounded-br-sm"
                          : "bg-gray-100 text-gray-800 rounded-bl-sm"
                      }`}
                    >
                      {m.text}
                      <p
                        className={`text-[10px] mt-1 ${isMe ? "text-white/60 text-right" : "text-gray-400"}`}
                      >
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
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
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-gray-50/50">
            <p className="text-sm text-gray-400">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
