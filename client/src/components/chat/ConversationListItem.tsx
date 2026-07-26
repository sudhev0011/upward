import { memo } from "react";
import { Conversation } from "@/interfaces/chat.interface";
import { getInitials } from "@/constants/chat.constant";

interface ConversationListItemProps {
  conversation: Conversation;
  isActive: boolean;
  unreadCount: number;
  onSelect: (id: string) => void;
  fallbackName?: string;
}

function ConversationListItemImpl({
  conversation,
  isActive,
  unreadCount,
  onSelect,
  fallbackName = "User",
}: ConversationListItemProps) {
  const participantName = conversation.participant?.name || fallbackName;
  const initials = getInitials(participantName);
  const imageUrl = conversation.participant?.avatar;
  const hasUnread = unreadCount > 0;

  return (
    <button
      onClick={() => onSelect(conversation.id)}
      className={`w-full flex items-center gap-3 p-4 text-left transition-all duration-200 border-b border-border/30 ${
        isActive ? "bg-primary/5 border-l-2 border-l-primary" : "hover:bg-secondary/30"
      }`}
    >
      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0 overflow-hidden">
        {!imageUrl ? (
          <span className="text-xs font-bold text-primary">{initials}</span>
        ) : (
          <img src={imageUrl} alt="Profile" loading="lazy" className="h-full w-full object-cover" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span
            className={`text-sm truncate ${
              hasUnread ? "font-bold text-card-foreground" : "font-semibold text-muted-foreground"
            }`}
          >
            {participantName}
          </span>
          <span className="text-[11px] text-muted-foreground shrink-0 ml-2">
            {conversation.lastMessage
              ? new Date(conversation.lastMessage.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}
          </span>
        </div>
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {conversation.lastMessage ? conversation.lastMessage.text : "No messages yet"}
        </p>
      </div>

      {hasUnread && (
        <span className="h-5 min-w-[20px] rounded-full bg-primary flex items-center justify-center text-[10px] text-primary-foreground font-bold px-1.5 shrink-0">
          {unreadCount}
        </span>
      )}
    </button>
  );
}

export const ConversationListItem = memo(ConversationListItemImpl);