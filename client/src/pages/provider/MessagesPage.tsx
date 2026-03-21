import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Search } from "lucide-react";
import { useState } from "react";

const conversations = [
  { id: 1, name: "Sarah Johnson", lastMessage: "Great, I'll confirm the venue details by tomorrow.", time: "2m ago", unread: 2, avatar: "SJ" },
  { id: 2, name: "Mike Chen", lastMessage: "The edited videos look amazing! Thank you.", time: "1h ago", unread: 0, avatar: "MC" },
  { id: 3, name: "Emily Davis", lastMessage: "Can we reschedule to next Friday?", time: "3h ago", unread: 1, avatar: "ED" },
  { id: 4, name: "James Wilson", lastMessage: "Sent you the product list for the shoot.", time: "1d ago", unread: 0, avatar: "JW" },
  { id: 5, name: "Rachel Green", lastMessage: "Looking forward to working with you!", time: "2d ago", unread: 0, avatar: "RG" },
];

const messages = [
  { id: 1, sender: "client", text: "Hi Alex! I wanted to discuss the wedding photography package.", time: "10:30 AM" },
  { id: 2, sender: "provider", text: "Of course! I'd love to help. What date is the wedding?", time: "10:32 AM" },
  { id: 3, sender: "client", text: "It's on April 15th. We're looking for full-day coverage with drone shots.", time: "10:35 AM" },
  { id: 4, sender: "provider", text: "That sounds wonderful! I have that date available. The Premium package would be perfect — it includes 8 hours of coverage plus drone footage.", time: "10:38 AM" },
  { id: 5, sender: "client", text: "Great, I'll confirm the venue details by tomorrow.", time: "10:40 AM" },
];

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState(1);
  const [newMessage, setNewMessage] = useState("");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Messages</h1>
        <p className="text-muted-foreground mt-1.5">Chat with your clients.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-240px)]">
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm lg:col-span-1 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-border/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search conversations..." className="pl-9 bg-secondary/30 border-border/50 rounded-xl" />
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveChat(conv.id)}
                className={`w-full flex items-center gap-3 p-4 text-left transition-all duration-200 border-b border-border/30 ${
                  activeChat === conv.id ? "bg-primary/5 border-l-2 border-l-primary" : "hover:bg-secondary/30"
                }`}
              >
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary">{conv.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-card-foreground">{conv.name}</span>
                    <span className="text-[11px] text-muted-foreground">{conv.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <span className="h-5 min-w-[20px] rounded-full bg-primary flex items-center justify-center text-[10px] text-primary-foreground font-bold px-1.5">
                    {conv.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </Card>

        <Card className="border-border/50 bg-card/80 backdrop-blur-sm lg:col-span-2 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-border/50 flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <span className="text-xs font-bold text-primary">SJ</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-card-foreground">Sarah Johnson</p>
              <p className="text-[11px] text-success font-medium">● Online</p>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "provider" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                  msg.sender === "provider"
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/10"
                    : "bg-secondary/50 text-card-foreground"
                }`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <p className={`text-[11px] mt-1.5 ${msg.sender === "provider" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-border/50">
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                className="bg-secondary/30 border-border/50 rounded-xl"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <Button size="icon" className="rounded-xl shrink-0 shadow-lg shadow-primary/20"><Send className="h-4 w-4" /></Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
