import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Search } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useAppSelector } from "@/hooks/useRedux";
import { useSocket } from "@/hooks/useSocket";
import { chatApi } from "@/api/chat.api";
import { Conversation, Message } from "@/interfaces/chat.interface";

export default function MessagesPage() {
  const currentUser = useAppSelector((state) => state.auth.user);
  const currentUserId = currentUser?.id || "";

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeChat, setActiveChat] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [search, setSearch] = useState("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Hook up Socket.IO connection
  const { socket } = useSocket(activeChat);

  // Fetch all conversations
  const fetchConversations = async () => {
    try {
      const response = await chatApi.getConversations();
      if (response.success && response.data) {
        setConversations(response.data);
        if (response.data.length > 0 && !activeChat) {
          setActiveChat(response.data[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Fetch messages for selected conversation
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
    if (activeChat) {
      fetchMessages(activeChat);

      // Reset unread count for provider
      chatApi.resetUnreadCount(activeChat, "provider").then(() => {
        socket?.emit("read_messages", {
          conversationId: activeChat,
          role: "provider",
        });
      });
    }
  }, [activeChat, socket]);

  // Handle socket events
  useEffect(() => {
    if (!socket) return;

    const handleMessageReceived = (message: Message) => {
      if (message.conversationId === activeChat) {
        setMessages((prev) => [...prev, message]);
        // Reset unread counts on server since we are active in this room
        chatApi.resetUnreadCount(activeChat, "provider").then(() => {
          socket.emit("read_messages", {
            conversationId: activeChat,
            role: "provider",
          });
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
  }, [socket, activeChat]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim() || !activeChat || !socket) return;

    socket.emit(
      "send_message",
      {
        conversationId: activeChat,
        text: newMessage.trim(),
      },
      (res: { success: boolean; error?: string }) => {
        if (!res.success) {
          console.error("Failed to send message:", res.error);
        }
      },
    );

    setNewMessage("");
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

  const selectedConversation = conversations.find((c) => c.id === activeChat);

  const filteredConversations = conversations.filter(
    (c) =>
      c.participant?.name.toLowerCase().includes(search.toLowerCase()) ||
      c.participant?.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Messages
        </h1>
        <p className="text-muted-foreground mt-1.5">Chat with your clients.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-240px)]">
        {/* Conversations Card */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm lg:col-span-1 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-border/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-9 bg-secondary/30 border-border/50 rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            {filteredConversations.map((conv) => {
              const hasUnread = conv.unreadCountProvider > 0;
              const participantName = conv.participant?.name || "Client";
              const initials = getInitials(participantName);
              const imageUrl = conv.participant?.avatar;
              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveChat(conv.id)}
                  className={`w-full flex items-center gap-3 p-4 text-left transition-all duration-200 border-b border-border/30 ${
                    activeChat === conv.id
                      ? "bg-primary/5 border-l-2 border-l-primary"
                      : "hover:bg-secondary/30"
                  }`}
                >
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0 overflow-hidden">
                    {!imageUrl ? (
                      <span className="text-xs font-bold text-primary">
                        {initials}
                      </span>
                    ) : (
                      <img
                        src={imageUrl}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm ${hasUnread ? "font-bold text-card-foreground" : "font-semibold text-muted-foreground"}`}
                      >
                        {participantName}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {conv.lastMessage
                          ? new Date(
                              conv.lastMessage.createdAt,
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {conv.lastMessage
                        ? conv.lastMessage.text
                        : "No messages yet"}
                    </p>
                  </div>
                  {hasUnread && (
                    <span className="h-5 min-w-[20px] rounded-full bg-primary flex items-center justify-center text-[10px] text-primary-foreground font-bold px-1.5">
                      {conv.unreadCountProvider}
                    </span>
                  )}
                </button>
              );
            })}
            {filteredConversations.length === 0 && (
              <div className="p-8 text-center text-xs text-muted-foreground">
                No conversations found
              </div>
            )}
          </div>
        </Card>

        {/* Chat Area Card */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm lg:col-span-2 flex flex-col overflow-hidden">
          {selectedConversation ? (
            <>
              <div className="flex items-center gap-3 border-b border-border/50 bg-background px-4 py-4">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-border/50 shadow-sm">
                  {!selectedConversation.participant?.avatar ? (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="text-xs font-bold text-primary">
                        {getInitials(
                          selectedConversation.participant?.name || "",
                        )}
                      </span>
                    </div>
                  ) : (
                    <img
                      src={selectedConversation.participant?.avatar}
                      alt={selectedConversation.participant?.name || "Profile"}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-card-foreground">
                    {selectedConversation.participant?.name}
                  </p>

                  <p className="truncate text-xs text-muted-foreground">
                    {selectedConversation.participant?.email}
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-4 space-y-3">
                {messages.map((msg) => {
                  const isMe = msg.senderId === currentUserId;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                          isMe
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/10"
                            : "bg-secondary/50 text-card-foreground"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                        <p
                          className={`text-[11px] mt-1.5 ${isMe ? "text-primary-foreground/60" : "text-muted-foreground"}`}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-border/50">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    className="bg-secondary/30 border-border/50 rounded-xl"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  />
                  <Button
                    size="icon"
                    className="rounded-xl shrink-0 shadow-lg shadow-primary/20"
                    onClick={handleSend}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-8 bg-secondary/10">
              <p className="text-sm text-muted-foreground">
                Select a conversation to start chatting
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
