import { memo } from "react";
import { Check, CheckCheck, Trash2 } from "lucide-react";
import { Message } from "@/interfaces/chat.interface";
import RenderAttachment from "@/components/common/chat/RenderAttachment";
import { EMOJI_PALETTE } from "@/constants/chat.constant";

interface MessageBubbleProps {
  msg: Message;
  isMe: boolean;
  currentUserId: string;
  otherParticipantId: string | undefined;
  onDelete: (messageId: string) => void;
  onReact: (messageId: string, emoji: string) => void;
}

const renderStatusTicks = (msg: Message, otherParticipantId: string | undefined) => {
  const isRead = otherParticipantId ? msg.userStates?.[otherParticipantId]?.isRead : false;
  if (isRead) {
    return <CheckCheck className="h-3.5 w-3.5 text-emerald-400 inline shrink-0" />;
  }
  if (msg.isDelivered) {
    return <CheckCheck className="h-3.5 w-3.5 text-primary-foreground/50 inline shrink-0" />;
  }
  return <Check className="h-3.5 w-3.5 text-primary-foreground/50 inline shrink-0" />;
};

function MessageBubbleImpl({
  msg,
  isMe,
  currentUserId,
  otherParticipantId,
  onDelete,
  onReact,
}: MessageBubbleProps) {
  const isDeleted = msg.userStates?.[currentUserId]?.isDeleted;
  const hasReactions = !!msg.reactions && Object.keys(msg.reactions).length > 0;

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} group relative mb-3`}>
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
                onClick={() => msg.id && onReact(msg.id, emoji)}
                className="hover:scale-125 active:scale-90 transition-transform text-base px-0.5"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      <div
        className={`flex items-center gap-2 max-w-[85%] sm:max-w-[75%] ${
          isMe ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {isDeleted ? (
          <div
            className={`rounded-2xl px-4 py-2.5 border border-dashed flex items-center gap-2 ${
              isMe
                ? "bg-secondary/20 text-muted-foreground border-border"
                : "bg-secondary/10 text-muted-foreground border-border/50"
            }`}
          >
            <span className="text-xs italic select-none">This message was deleted</span>
          </div>
        ) : (
          <>
            <div
              className={`rounded-2xl px-4 py-3 relative transition-all duration-150 ${
                isMe
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/10"
                  : "bg-secondary/50 text-card-foreground"
              } ${hasReactions ? "mb-2" : ""}`}
            >
              {msg.text && <p className="text-sm leading-relaxed break-words">{msg.text}</p>}
              {msg.attachmentUrl && RenderAttachment(msg.attachmentUrl, isMe)}

              <div className="flex items-center justify-end gap-1.5 mt-1.5">
                <span
                  className={`text-[11px] ${
                    isMe ? "text-primary-foreground/60" : "text-muted-foreground"
                  }`}
                >
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {isMe && renderStatusTicks(msg, otherParticipantId)}
              </div>

              {hasReactions && (
                <div
                  className={`absolute -bottom-2.5 flex items-center gap-0.5 bg-background border border-border/80 shadow-sm rounded-full px-1.5 py-0.5 select-none ${
                    isMe ? "left-2" : "right-2"
                  }`}
                >
                  {Object.entries(msg.reactions!).map(([userId, userReactionEmoji]) => (
                    <span
                      key={userId}
                      className="text-xs"
                      title={userId === currentUserId ? "You reacted" : "Participant reacted"}
                    >
                      {userReactionEmoji}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => msg.id && onDelete(msg.id)}
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
}

export const MessageBubble = memo(MessageBubbleImpl);