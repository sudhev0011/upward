import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Search, Paperclip, Loader2, ChevronLeft } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { ConversationListItem } from "./ConversationListItem";
import { useChat,ChatRole } from "@/hooks/chat/useChat";
import { getInitials } from "@/constants/chat.constant";

interface ChatPageProps {
  role: ChatRole;
}

export default function ChatPage({ role }: ChatPageProps) {
  const {
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
  } = useChat({ role });

  const fallbackName = role === "provider" ? "Client" : "Provider";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-180px)] min-h-[500px]">
      
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
            const unreadCount =
              role === "provider" ? conv.unreadCountProvider : conv.unreadCountClient;

            return (
              <ConversationListItem
                key={conv.id}
                conversation={conv}
                isActive={activeChat === conv.id}
                unreadCount={unreadCount ?? 0}
                onSelect={setActiveChat}
                fallbackName={fallbackName}
              />
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
              {/* Back button — mobile/tablet only, returns to the list */}
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
                      {getInitials(selectedConversation.participant?.name || "")}
                    </span>
                  </div>
                ) : (
                  <img
                    src={selectedConversation.participant?.avatar}
                    alt={selectedConversation.participant?.name || fallbackName}
                    loading="lazy"
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
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  msg={msg}
                  isMe={msg.senderId === currentUserId}
                  currentUserId={currentUserId}
                  otherParticipantId={otherParticipantId}
                  onDelete={handleDeleteMessage}
                  onReact={handleEmitReaction}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-border/50">
              <div className="flex gap-2">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
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
            <p className="text-sm text-muted-foreground">Select a conversation to start chatting</p>
          </div>
        )}
      </Card>
    </div>
  );
}