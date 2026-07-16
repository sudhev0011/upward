import { useEffect, useState, useRef } from "react";
import { Search, Send, Paperclip, Loader2, Check, CheckCheck, Trash2 } from "lucide-react";
import { useAppSelector } from "@/hooks/useRedux";
import { useSocket } from "@/hooks/useSocket";
import { chatApi } from "@/api/chat.api";
import { Conversation, Message } from "@/interfaces/chat.interface";
import { useUploadChatAttachment } from "@/hooks/chat/useUploadChatAttachment";
import { toast } from "sonner";
import RenderAttachment from "@/components/common/chat/RenderAttachment";

const renderStatusTicks = (msg: Message, otherParticipantId: string | undefined) => {
  const isRead = otherParticipantId ? msg.userStates?.[otherParticipantId]?.isRead : false;
  if (isRead) {
    return <CheckCheck className="h-3.5 w-3.5 text-emerald-400 inline shrink-0" />;
  }
  if (msg.isDelivered) {
    return <CheckCheck className="h-3.5 w-3.5 text-white/50 inline shrink-0" />;
  }
  return <Check className="h-3.5 w-3.5 text-white/50 inline shrink-0" />;
};


const MessagesPage = () => {
  const currentUser = useAppSelector((state) => state.auth.user);
  const currentUserId = currentUser?.id || "";

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeThread, setActiveThread] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const uploadAttachmentMutation = useUploadChatAttachment();

  const { socket } = useSocket(activeThread);

  const selectedThread = conversations.find((t) => t.id === activeThread);
  const otherParticipantId = selectedThread?.clientId === currentUserId ? selectedThread?.providerId : selectedThread?.clientId;

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeThread || !socket) return;

    const toastId = toast.loading(`Uploading ${file.name}...`);
    try {
      const { fileUrl } = await uploadAttachmentMutation.mutateAsync(file);
      
      socket.emit(
        "send_message",
        {
          conversationId: activeThread,
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
        }
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
    if (!socket || !activeThread) return;

    socket.emit(
      "delete_message",
      { messageId, conversationId: activeThread },
      (res: { success: boolean; error?: string }) => {
        if (!res.success) {
          toast.error(res.error || "Failed to delete message");
        } else {
          toast.success("Message deleted");
        }
      }
    );
  };

  const fetchConversations = async () => {
    try {
      const response = await chatApi.getConversations();
      if (response.success && response.data) {
        setConversations(response.data);
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

      chatApi.resetUnreadCount(activeThread, "client").then(() => {
        socket?.emit("read_messages", {
          conversationId: activeThread,
          role: "client",
        });
      });
    }
  }, [activeThread, socket]);

  useEffect(() => {
    if (!socket) return;

    const handleMessageReceived = (message: Message) => {
      if (message.conversationId === activeThread) {
        setMessages((prev) => [...prev, message]);
        chatApi.resetUnreadCount(activeThread, "client").then(() => {
          socket.emit("read_messages", {
            conversationId: activeThread,
            role: "client",
          });
        });
      }
    };

    const handleConversationUpdated = () => {
      fetchConversations();
    };

    const handleMessageDeleted = (data: { messageId: string; userId: string }) => {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === data.messageId) {
            const updatedStates = {
              ...msg.userStates,
              [data.userId]: {
                ...msg.userStates?.[data.userId],
                isDeleted: true
              }
            };
            return { ...msg, userStates: updatedStates };
          }
          return msg;
        })
      );
    };

    const handleMessagesDelivered = (data: { conversationId: string }) => {
      if (data.conversationId === activeThread) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.senderId === currentUserId ? { ...msg, isDelivered: true } : msg
          )
        );
      }
    };

    const handleMessagesRead = (data: { conversationId: string; role: 'client' | 'provider' }) => {
      if (data.conversationId === activeThread && data.role === 'provider' && otherParticipantId) {
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.senderId === currentUserId) {
              const updatedStates = {
                ...msg.userStates,
                [otherParticipantId]: {
                  ...msg.userStates?.[otherParticipantId],
                  isRead: true
                }
              };
              return { ...msg, isDelivered: true, userStates: updatedStates };
            }
            return msg;
          })
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
  }, [socket, activeThread, otherParticipantId, currentUserId]);

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
      },
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



  const filteredThreads = conversations.filter(
    (t) =>
      t.participant?.name.toLowerCase().includes(search.toLowerCase()) ||
      t.participant?.email.toLowerCase().includes(search.toLowerCase()),
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
            const imageUrl = t.participant?.avatar;

            return (
              <div
                key={t.id}
                onClick={() => setActiveThread(t.id)}
                className={`flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-colors ${
                  t.id === activeThread ? "bg-[#EAF2F9]" : "hover:bg-gray-50"
                }`}
              >
                <div className="relative shrink-0">
                  <div className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-white shadow-sm bg-gradient-to-br from-[#719FC4] to-[#5A87B0]">
                    {!imageUrl ? (
                      <div className="flex h-full w-full items-center justify-center text-xs font-bold text-white">
                        {initials}
                      </div>
                    ) : (
                      <img
                        src={imageUrl}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>

                  {hasUnread && (
                    <span className="absolute -top-1 -right-1 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#719FC4] px-1 text-[10px] font-bold text-white ring-2 ring-white">
                      {t.unreadCountClient > 99 ? "99+" : t.unreadCountClient}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-sm truncate ${hasUnread ? "font-bold text-gray-900" : "font-semibold text-gray-700"}`}
                    >
                      {participantName}
                    </p>
                    <p className="text-[10px] text-gray-400 shrink-0 ml-1">
                      {t.lastMessage
                        ? new Date(t.lastMessage.createdAt).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" },
                          )
                        : ""}
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
            <div className="flex items-center gap-3 border-b border-gray-100 bg-white px-5 py-4">
              <div className="h-11 w-11 overflow-hidden rounded-full ring-2 ring-gray-100 shadow-sm bg-gradient-to-br from-[#719FC4] to-[#5A87B0] shrink-0">
                {!selectedThread.participant?.avatar ? (
                  <div className="flex h-full w-full items-center justify-center text-sm font-bold text-white">
                    {getInitials(selectedThread.participant?.name || "")}
                  </div>
                ) : (
                  <img
                    src={selectedThread.participant?.avatar}
                    alt={selectedThread.participant?.name || "Profile"}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {selectedThread.participant?.name}
                </p>

                <p className="truncate text-xs text-gray-500">
                  {selectedThread.participant?.email}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
              {messages.map((msg) => {
                const isMe = msg.senderId === currentUserId;
                const isDeleted = msg.userStates?.[currentUserId]?.isDeleted;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"} group relative`}
                  >
                    <div className={`flex items-center gap-2 max-w-[75%] ${isMe ? "flex-row-reverse" : "flex-row"}`}>
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
                              <span className={`text-[11px] ${isMe ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                                {new Date(msg.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              {isMe && renderStatusTicks(msg, otherParticipantId)}
                            </div>
                          </div>

                          <button
                            onClick={() => msg.id && handleDeleteMessage(msg.id)}
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

            {/* Input */}
            <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-2">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
              />
              <button 
                onClick={handleAttachmentClick}
                disabled={uploadAttachmentMutation.isPending}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                {uploadAttachmentMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                ) : (
                  <Paperclip className="h-4 w-4" />
                )}
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
            <p className="text-sm text-gray-400">
              Select a conversation to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
