import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAppSelector } from "@/hooks/useRedux";
import { useSocket } from "@/hooks/useSocket";
import { useDebounce } from "@/hooks/useDebounce";
import { chatApi } from "@/api/chat.api";
import { Conversation, Message } from "@/interfaces/chat.interface";
import { useUploadChatAttachment } from "@/hooks/chat/useUploadChatAttachment";
import { toast } from "sonner";

export type ChatRole = "client" | "provider";

interface UseChatOptions {
  role: ChatRole;
}

const SEARCH_DEBOUNCE_MS = 200;

export function useChat({ role }: UseChatOptions) {
  const currentUser = useAppSelector((state) => state.auth.user);
  const currentUserId = currentUser?.id || "";

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeChat, setActiveChat] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, SEARCH_DEBOUNCE_MS);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const uploadAttachmentMutation = useUploadChatAttachment();

  const { socket } = useSocket(activeChat);

  const selectedConversation = useMemo(
    () => conversations.find((c) => c.id === activeChat),
    [conversations, activeChat],
  );

  const otherParticipantId =
    selectedConversation?.clientId === currentUserId
      ? selectedConversation?.providerId
      : selectedConversation?.clientId;

  const activeChatRef = useRef(activeChat);
  const otherParticipantIdRef = useRef(otherParticipantId);
  const currentUserIdRef = useRef(currentUserId);

  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);
  useEffect(() => {
    otherParticipantIdRef.current = otherParticipantId;
  }, [otherParticipantId]);
  useEffect(() => {
    currentUserIdRef.current = currentUserId;
  }, [currentUserId]);

  const fetchConversations = useCallback(async () => {
    try {
      const response = await chatApi.getConversations();
      if (response.success && response.data) {
        const data = response.data;
        setConversations(data);
        const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;
        if (isDesktop) {
          setActiveChat((prev) => prev || data[0]?.id || "");
        }
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const fetchMessages = useCallback(async (conversationId: string) => {
    try {
      const response = await chatApi.getMessages(conversationId);
      if (response.success && response.data) {
        setMessages(response.data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, []);

  useEffect(() => {
    if (!activeChat) return;

    fetchMessages(activeChat);

    chatApi.resetUnreadCount(activeChat, role).then(() => {
      socket?.emit("read_messages", { conversationId: activeChat, role });
    });
  }, [activeChat, socket, role]);

  useEffect(() => {
    if (!socket) return;

    const handleMessageReceived = (message: Message) => {
      if (message.conversationId !== activeChatRef.current) return;

      setMessages((prev) => [...prev, message]);
      chatApi.resetUnreadCount(activeChatRef.current, role).then(() => {
        socket.emit("read_messages", {
          conversationId: activeChatRef.current,
          role,
        });
      });
    };

    const handleConversationUpdated = () => {
      fetchConversations();
    };

    const handleMessageDeleted = (data: { messageId: string; userId: string }) => {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id !== data.messageId) return msg;
          return {
            ...msg,
            userStates: {
              ...msg.userStates,
              [data.userId]: { ...msg.userStates?.[data.userId], isDeleted: true },
            },
          };
        }),
      );
    };

    const handleMessagesDelivered = (data: { conversationId: string }) => {
      if (data.conversationId !== activeChatRef.current) return;
      setMessages((prev) =>
        prev.map((msg) =>
          msg.senderId === currentUserIdRef.current ? { ...msg, isDelivered: true } : msg,
        ),
      );
    };

    const handleMessagesRead = (data: {
      conversationId: string;
      role: ChatRole;
    }) => {
      const otherId = otherParticipantIdRef.current;
      const readByOtherParty = data.role !== role;

      if (data.conversationId !== activeChatRef.current || !readByOtherParty || !otherId) {
        return;
      }

      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.senderId !== currentUserIdRef.current) return msg;
          return {
            ...msg,
            isDelivered: true,
            userStates: {
              ...msg.userStates,
              [otherId]: { ...msg.userStates?.[otherId], isRead: true },
            },
          };
        }),
      );
    };

    const handleReactionUpdated = (data: {
      messageId: string;
      userId: string;
      reaction: string;
    }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === data.messageId
            ? { ...msg, reactions: { ...msg.reactions, [data.userId]: data.reaction } }
            : msg,
        ),
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
  }, [socket, role, fetchConversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(() => {
    if (!newMessage.trim() || !activeChat || !socket) return;

    socket.emit(
      "send_message",
      { conversationId: activeChat, text: newMessage.trim() },
      (res: { success: boolean; error?: string }) => {
        if (!res.success) {
          console.error("Failed to send message:", res.error);
        }
      },
    );

    setNewMessage("");
  }, [newMessage, activeChat, socket]);

  const handleDeleteMessage = useCallback(
    (messageId: string) => {
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
    },
    [socket, activeChat],
  );

  const handleEmitReaction = useCallback(
    (messageId: string, emoji: string) => {
      if (!socket || !activeChat) return;

      socket.emit("send_message_reaction", {
        messageId,
        conversationId: activeChat,
        reaction: emoji,
      });
    },
    [socket, activeChat],
  );

  const handleAttachmentClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !activeChat || !socket) return;

      const toastId = toast.loading(`Uploading ${file.name}...`);
      try {
        const { fileUrl } = await uploadAttachmentMutation.mutateAsync(file);

        socket.emit(
          "send_message",
          { conversationId: activeChat, text: "", attachmentUrl: fileUrl },
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
    },
    [activeChat, socket, uploadAttachmentMutation],
  );

  const filteredConversations = useMemo(
    () =>
      conversations.filter(
        (c) =>
          c.participant?.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          c.participant?.email.toLowerCase().includes(debouncedSearch.toLowerCase()),
      ),
    [conversations, debouncedSearch],
  );

  return {
    currentUserId,
    filteredConversations,
    search,
    setSearch,
    activeChat,
    setActiveChat,
    selectedConversation,
    otherParticipantId,
    messages,
    newMessage,
    setNewMessage,
    messagesEndRef,
    fileInputRef,
    uploadAttachmentMutation,
    handleSend,
    handleDeleteMessage,
    handleEmitReaction,
    handleAttachmentClick,
    handleFileChange,
  };
}