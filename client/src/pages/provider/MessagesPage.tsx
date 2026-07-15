import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Send,
  Search,
  Paperclip,
  Loader2,
  Check,
  CheckCheck,
  Trash2,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useAppSelector } from "@/hooks/useRedux";
import { useSocket } from "@/hooks/useSocket";
import { chatApi } from "@/api/chat.api";
import { Conversation, Message } from "@/interfaces/chat.interface";
import { useUploadChatAttachment } from "@/hooks/chat/useUploadChatAttachment";
import { toast } from "sonner";
import RenderAttachment from "@/components/common/chat/RenderAttachment";

const renderStatusTicks = (
  msg: Message,
  otherParticipantId: string | undefined,
) => {
  const isRead = otherParticipantId
    ? msg.userStates?.[otherParticipantId]?.isRead
    : false;
  if (isRead) {
    return (
      <CheckCheck className="h-3.5 w-3.5 text-emerald-400 inline shrink-0" />
    );
  }
  if (msg.isDelivered) {
    return (
      <CheckCheck className="h-3.5 w-3.5 text-primary-foreground/50 inline shrink-0" />
    );
  }
  return (
    <Check className="h-3.5 w-3.5 text-primary-foreground/50 inline shrink-0" />
  );
};

export default function MessagesPage() {
  const currentUser = useAppSelector((state) => state.auth.user);
  const currentUserId = currentUser?.id || "";

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeChat, setActiveChat] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [search, setSearch] = useState("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const uploadAttachmentMutation = useUploadChatAttachment();

  const { socket } = useSocket(activeChat);

  const selectedConversation = conversations.find((c) => c.id === activeChat);
  const otherParticipantId =
    selectedConversation?.clientId === currentUserId
      ? selectedConversation?.providerId
      : selectedConversation?.clientId;

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeChat || !socket) return;

    const toastId = toast.loading(`Uploading ${file.name}...`);
    try {
      const { fileUrl } = await uploadAttachmentMutation.mutateAsync(file);

      socket.emit(
        "send_message",
        {
          conversationId: activeChat,
          text: "",
          attachmentUrl: fileUrl,
        },
        (res: { success: boolean; error?: string }) => {
          if (!res.success) {
            console.error("Failed to send message:", res.error);
            toast.error("Failed to send attachment", { id: toastId });
          } else {
            toast.success("Attachment sent!", { id: toastId });
          }
        },
      );
    } catch (err: unknown) {
      console.error("Upload failed:", err);
      const errorMsg = err instanceof Error ? err.message : "Upload failed";
      toast.error(errorMsg, { id: toastId });
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    if (!socket || !activeChat) return;

    socket.emit(
      "delete_message",
      { messageId, conversationId: activeChat },
      (res: { success: boolean; error?: string }) => {
        if (!res.success) {
          toast.error(res.error || "Failed to delete message");
        } else {
          toast.success("Message deleted");
        }
      },
    );
  };

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

      chatApi.resetUnreadCount(activeChat, "provider").then(() => {
        socket?.emit("read_messages", {
          conversationId: activeChat,
          role: "provider",
        });
      });
    }
  }, [activeChat, socket]);

  useEffect(() => {
    if (!socket) return;

    const handleMessageReceived = (message: Message) => {
      if (message.conversationId === activeChat) {
        setMessages((prev) => [...prev, message]);
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

    const handleMessageDeleted = (data: {
      messageId: string;
      userId: string;
    }) => {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === data.messageId) {
            const updatedStates = {
              ...msg.userStates,
              [data.userId]: {
                ...msg.userStates?.[data.userId],
                isDeleted: true,
              },
            };
            return { ...msg, userStates: updatedStates };
          }
          return msg;
        }),
      );
    };

    const handleMessagesDelivered = (data: { conversationId: string }) => {
      if (data.conversationId === activeChat) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.senderId === currentUserId
              ? { ...msg, isDelivered: true }
              : msg,
          ),
        );
      }
    };

    const handleMessagesRead = (data: {
      conversationId: string;
      role: "client" | "provider";
    }) => {
      if (
        data.conversationId === activeChat &&
        data.role === "client" &&
        otherParticipantId
      ) {
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.senderId === currentUserId) {
              const updatedStates = {
                ...msg.userStates,
                [otherParticipantId]: {
                  ...msg.userStates?.[otherParticipantId],
                  isRead: true,
                },
              };
              return { ...msg, isDelivered: true, userStates: updatedStates };
            }
            return msg;
          }),
        );
      }
    };

    socket.on("message_received", handleMessageReceived);
    socket.on("conversation_updated", handleConversationUpdated);
    socket.on("message_deleted", handleMessageDeleted);
    socket.on("messages_delivered", handleMessagesDelivered);
    socket.on("messages_read", handleMessagesRead);

    return () => {
      socket.off("message_received", handleMessageReceived);
      socket.off("conversation_updated", handleConversationUpdated);
      socket.off("message_deleted", handleMessageDeleted);
      socket.off("messages_delivered", handleMessagesDelivered);
      socket.off("messages_read", handleMessagesRead);
    };
  }, [socket, activeChat, otherParticipantId, currentUserId]);

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

  const filteredConversations = conversations.filter(
    (c) =>
      c.participant?.name.toLowerCase().includes(search.toLowerCase()) ||
      c.participant?.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Messages
        </h1>
        <p className="text-muted-foreground mt-1.5">Chat with your clients.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-180px)]">
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
                        className={`text-sm truncate ${hasUnread ? "font-bold text-card-foreground" : "font-semibold text-muted-foreground"}`}
                      >
                        {participantName}
                      </span>
                      <span className="text-[11px] text-muted-foreground shrink-0 ml-2">
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
                    <span className="h-5 min-w-[20px] rounded-full bg-primary flex items-center justify-center text-[10px] text-primary-foreground font-bold px-1.5 shrink-0">
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

        <Card className="border-border/50 bg-card/80 backdrop-blur-sm lg:col-span-3 flex flex-col overflow-hidden">
          {selectedConversation ? (
            <>
              <div className="flex items-center gap-3 border-b border-border/50 bg-background px-4 py-2">
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

              <div className="flex-1 overflow-auto p-6 space-y-4">
                {messages.map((msg) => {
                  const isMe = msg.senderId === currentUserId;
                  const isDeleted = msg.userStates?.[currentUserId]?.isDeleted;

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMe ? "justify-end" : "justify-start"} group relative`}
                    >
                      <div
                        className={`flex items-center gap-2 max-w-[75%] ${isMe ? "flex-row-reverse" : "flex-row"}`}
                      >
                        {isDeleted ? (
                          <div
                            className={`rounded-2xl px-4 py-2.5 border border-dashed flex items-center gap-2 ${
                              isMe
                                ? "bg-secondary/20 text-muted-foreground border-border"
                                : "bg-secondary/10 text-muted-foreground border-border/50"
                            }`}
                          >
                            <span className="text-xs italic select-none">
                              This message was deleted
                            </span>
                            <span className="text-[10px] text-muted-foreground/60 ml-2">
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        ) : (
                          <>
                            <div
                              className={`rounded-2xl px-4 py-3 ${
                                isMe
                                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/10"
                                  : "bg-secondary/50 text-card-foreground"
                              }`}
                            >
                              {msg.text && (
                                <p className="text-sm leading-relaxed">
                                  {msg.text}
                                </p>
                              )}
                              {msg.attachmentUrl &&
                                RenderAttachment(msg.attachmentUrl, isMe)}

                              <div className="flex items-center justify-end gap-1.5 mt-1.5">
                                <span
                                  className={`text-[11px] ${isMe ? "text-primary-foreground/60" : "text-muted-foreground"}`}
                                >
                                  {new Date(msg.createdAt).toLocaleTimeString(
                                    [],
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    },
                                  )}
                                </span>
                                {isMe &&
                                  renderStatusTicks(msg, otherParticipantId)}
                              </div>
                            </div>

                            <button
                              onClick={() =>
                                msg.id && handleDeleteMessage(msg.id)
                              }
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 duration-200 shrink-0"
                              title="Delete Message"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-border/50">
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={uploadAttachmentMutation.isPending}
                    className="rounded-xl shrink-0 border-border/50 text-muted-foreground hover:text-foreground hover:bg-secondary/30 disabled:opacity-50"
                    onClick={handleAttachmentClick}
                  >
                    {uploadAttachmentMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Paperclip className="h-4 w-4" />
                    )}
                  </Button>
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
