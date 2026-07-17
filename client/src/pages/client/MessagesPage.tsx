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
  ChevronLeft,
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
        if (
          response.data.length > 0 &&
          !activeChat &&
          window.innerWidth >= 1024
        ) {
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

      // Swapped target role to client
      chatApi.resetUnreadCount(activeChat, "client").then(() => {
        socket?.emit("read_messages", {
          conversationId: activeChat,
          role: "client",
        });
      });
    }
  }, [activeChat, socket]);

  useEffect(() => {
    if (!socket) return;

    const handleMessageReceived = (message: Message) => {
      if (message.conversationId === activeChat) {
        setMessages((prev) => [...prev, message]);
        // Swapped target role to client
        chatApi.resetUnreadCount(activeChat, "client").then(() => {
          socket.emit("read_messages", {
            conversationId: activeChat,
            role: "client",
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
      // Swapped evaluation role to check if provider read client's messages
      if (
        data.conversationId === activeChat &&
        data.role === "provider" &&
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

    const handleReactionUpdated = (data: {
      messageId: string;
      userId: string;
      reaction: string;
    }) => {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === data.messageId) {
            return {
              ...msg,
              reactions: {
                ...msg.reactions,
                [data.userId]: data.reaction,
              },
            };
          }
          return msg;
        }),
      );
    };

    socket.on("message_received", handleMessageReceived);
    socket.on("conversation_updated", handleConversationUpdated);
    socket.on("message_deleted", handleMessageDeleted);
    socket.on("messages_delivered", handleMessagesDelivered);
    socket.on("messages_read", handleMessagesRead);
    socket.on("message_reaction_updated", handleReactionUpdated);

    return () => {
      socket.off("message_received", handleMessageReceived);
      socket.off("conversation_updated", handleConversationUpdated);
      socket.off("message_deleted", handleMessageDeleted);
      socket.off("messages_delivered", handleMessagesDelivered);
      socket.off("messages_read", handleMessagesRead);
      socket.off("message_reaction_updated", handleReactionUpdated);
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
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-180px)] min-h-[500px]">
      {/* CONVERSATION LIST PANEL */}
      <Card
        className={`border-border/50 bg-card/80 backdrop-blur-sm lg:col-span-1 flex flex-col overflow-hidden transition-all duration-300 ${
          activeChat ? "hidden lg:flex" : "flex"
        }`}
      >
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
            // Swapped tracking variable to client unread counts
            const hasUnread = conv.unreadCountClient > 0;
            const participantName = conv.participant?.name || "Provider";
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
                    {conv.unreadCountClient}
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

      {/* CHAT WINDOW PANEL */}
      <Card
        className={`border-border/50 bg-card/80 backdrop-blur-sm lg:col-span-3 flex flex-col overflow-hidden transition-all duration-300 ${
          !activeChat ? "hidden lg:flex" : "flex"
        }`}
      >
        {selectedConversation ? (
          <>
            <div className="flex items-center gap-3 border-b border-border/50 bg-background px-4 py-3">
              {/* BACK BUTTON - Visually responsive (Only visible on mobile/tablets) */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveChat("")}
                className="lg:hidden -ml-2 h-9 w-9 text-muted-foreground"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

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

            <div className="flex-1 overflow-auto p-4 md:p-6 space-y-4">
              {/* {messages.map((msg) => {
                const isMe = msg.senderId === currentUserId;
                const isDeleted = msg.userStates?.[currentUserId]?.isDeleted;

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"} group relative`}
                  >
                    <div className={`flex items-center gap-2 max-w-[85%] sm:max-w-[75%] ${isMe ? "flex-row-reverse" : "flex-row"}`}>
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
                              <p className="text-sm leading-relaxed break-words">
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
                            className="lg:opacity-0 lg:group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 duration-200 shrink-0 p-1"
                            title="Delete Message"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })} */}

              {messages.map((msg) => {
                const isMe = msg.senderId === currentUserId;
                const isDeleted = msg.userStates?.[currentUserId]?.isDeleted;

                // The WhatsApp emoji lineup
                const EMOJI_PALETTE = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

                const handleEmitReaction = (emoji: string) => {
                  if (!socket || !activeChat || !msg.id) return;

                  // Emit the exact event our updated backend socket is listening for
                  socket.emit("send_message_reaction", {
                    messageId: msg.id,
                    conversationId: activeChat,
                    reaction: emoji,
                  });
                };

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"} group relative mb-3`}
                  >
                    {!isDeleted && (
                      <div
                        className={`absolute -top-10 z-10 hidden group-hover:flex items-center justify-center pt-2 pb-2 px-4 transition-all duration-150 ${
                          isMe ? "right-2" : "left-2"
                        }`}
                      >
                        <div className="flex items-center gap-1 bg-background border border-border/60 shadow-md rounded-full px-2 py-0.5 backdrop-blur-sm">
                          {EMOJI_PALETTE.map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => handleEmitReaction(emoji)}
                              className="hover:scale-125 active:scale-90 transition-transform text-base px-0.5"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div
                      className={`flex items-center gap-2 max-w-[85%] sm:max-w-[75%] ${isMe ? "flex-row-reverse" : "flex-row"}`}
                    >
                      {isDeleted ? (
                        <div
                          className={`rounded-2xl px-4 py-2.5 border border-dashed flex items-center gap-2 ${isMe ? "bg-secondary/20 text-muted-foreground border-border" : "bg-secondary/10 text-muted-foreground border-border/50"}`}
                        >
                          <span className="text-xs italic select-none">
                            This message was deleted
                          </span>
                        </div>
                      ) : (
                        <>
                          {/* MESSAGE CHAT CONTENT CONTAINER */}
                          <div
                            className={`rounded-2xl px-4 py-3 relative transition-all duration-150 ${
                              isMe
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/10"
                                : "bg-secondary/50 text-card-foreground"
                            } ${msg.reactions && Object.keys(msg.reactions).length > 0 ? "mb-2" : ""}`}
                          >
                            {msg.text && (
                              <p className="text-sm leading-relaxed break-words">
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
                                  { hour: "2-digit", minute: "2-digit" },
                                )}
                              </span>
                              {isMe &&
                                renderStatusTicks(msg, otherParticipantId)}
                            </div>

                            {/* RENDER ACTIVE REACTIONS ON MESSAGE PILL BASE */}
                            {msg.reactions &&
                              Object.keys(msg.reactions).length > 0 && (
                                <div
                                  className={`absolute -bottom-2.5 flex items-center gap-0.5 bg-background border border-border/80 shadow-sm rounded-full px-1.5 py-0.5 select-none ${
                                    isMe ? "left-2" : "right-2"
                                  }`}
                                >
                                  {Object.entries(msg.reactions).map(
                                    ([userId, userReactionEmoji]) => (
                                      <span
                                        key={userId}
                                        className="text-xs"
                                        title={
                                          userId === currentUserId
                                            ? "You reacted"
                                            : "Participant reacted"
                                        }
                                      >
                                        {userReactionEmoji}
                                      </span>
                                    ),
                                  )}
                                </div>
                              )}
                          </div>

                          <button
                            onClick={() =>
                              msg.id && handleDeleteMessage(msg.id)
                            }
                            className="lg:opacity-0 lg:group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 duration-200 shrink-0 p-1"
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
  );
}
