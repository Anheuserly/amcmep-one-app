"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatRelative } from "@/lib/utils";
import {
  MessageSquare, Send, Paperclip, Image, Search, MoreVertical, Check, CheckCheck, ChevronLeft
} from "lucide-react";
import type { ChatSession, ChatMessage } from "@/types";

const mockSessions: ChatSession[] = [
  { $id: "1", type: "business", participantIds: ["user1", "biz1"], participantNames: ["You", "Shree Ganesh Enterprises"], participantAvatars: ["", ""], businessId: "biz1", businessName: "Shree Ganesh Enterprises", lastMessage: "We will arrive at 10 AM tomorrow", lastMessageAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), unreadCount: 2, createdAt: "2024-01-01" },
  { $id: "2", type: "customer", participantIds: ["user1", "user2"], participantNames: ["You", "Rahul Kumar"], participantAvatars: ["", ""], lastMessage: "Thanks for the update on the HVAC request", lastMessageAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), unreadCount: 0, createdAt: "2024-01-02" },
  { $id: "3", type: "business", participantIds: ["user1", "biz2"], participantNames: ["You", "Agni Fire Safety"], participantAvatars: ["", ""], businessId: "biz2", businessName: "Agni Fire Safety", lastMessage: "Your AMC renewal is due next week", lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), unreadCount: 1, createdAt: "2024-01-03" },
  { $id: "4", type: "partner", participantIds: ["user1", "user3"], participantNames: ["You", "Vikram Singh"], participantAvatars: ["", ""], lastMessage: "Can you cover the site visit on Saturday?", lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), unreadCount: 0, createdAt: "2024-01-04" },
  { $id: "5", type: "support", participantIds: ["user1", "support"], participantNames: ["You", "AMC Support"], participantAvatars: ["", ""], lastMessage: "Your ticket #1234 has been resolved", lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), unreadCount: 0, createdAt: "2024-01-05" },
  { $id: "6", type: "business", participantIds: ["user1", "biz3"], participantNames: ["You", "CoolAir HVAC"], participantAvatars: ["", ""], businessId: "biz3", businessName: "CoolAir HVAC", lastMessage: "Quote attached for the new installation", lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), unreadCount: 0, createdAt: "2024-01-06" },
];

const mockMessages: Record<string, ChatMessage[]> = {
  "1": [
    { $id: "m1", sessionId: "1", senderId: "biz1", senderName: "Shree Ganesh Enterprises", type: "text", content: "Hi, we received your fire safety inspection request", createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
    { $id: "m2", sessionId: "1", senderId: "user1", senderName: "You", type: "text", content: "Great, when can you visit?", createdAt: new Date(Date.now() - 1000 * 60 * 55).toISOString() },
    { $id: "m3", sessionId: "1", senderId: "biz1", senderName: "Shree Ganesh Enterprises", type: "text", content: "We will arrive at 10 AM tomorrow", createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
  ],
  "2": [
    { $id: "m4", sessionId: "2", senderId: "user2", senderName: "Rahul Kumar", type: "text", content: "The HVAC service is completed", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
    { $id: "m5", sessionId: "2", senderId: "user1", senderName: "You", type: "text", content: "Thanks for the update on the HVAC request", createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  ],
  "3": [
    { $id: "m6", sessionId: "3", senderId: "biz2", senderName: "Agni Fire Safety", type: "text", content: "Your AMC renewal is due next week", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  ],
  "4": [
    { $id: "m7", sessionId: "4", senderId: "user3", senderName: "Vikram Singh", type: "text", content: "Can you cover the site visit on Saturday?", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
  ],
  "5": [
    { $id: "m8", sessionId: "5", senderId: "support", senderName: "AMC Support", type: "text", content: "Your ticket #1234 has been resolved", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  ],
  "6": [
    { $id: "m9", sessionId: "6", senderId: "biz3", senderName: "CoolAir HVAC", type: "text", content: "Quote attached for the new installation", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
  ],
};

export default function ChatsPage() {
  const { profile } = useAuth();
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>("1");
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileChatOpen, setMobileChatOpen] = useState(false);

  const filteredSessions = mockSessions.filter((s) =>
    s.participantNames.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (s.lastMessage && s.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const selectedSession = mockSessions.find((s) => s.$id === selectedSessionId);
  const messages = selectedSessionId ? mockMessages[selectedSessionId] || [] : [];
  const otherParticipant = selectedSession?.participantNames.find((_, i) => selectedSession.participantIds[i] !== profile?.userId) || "Unknown";

  const handleSend = () => {
    if (!messageInput.trim() || !selectedSessionId) return;
    const newMsg: ChatMessage = {
      $id: `new-${Date.now()}`,
      sessionId: selectedSessionId,
      senderId: profile?.userId || "user1",
      senderName: "You",
      type: "text",
      content: messageInput.trim(),
      createdAt: new Date().toISOString(),
    };
    mockMessages[selectedSessionId] = [...(mockMessages[selectedSessionId] || []), newMsg];
    setMessageInput("");
  };

  return (
    <div className="animate-fade-in h-[calc(100vh-8rem)] -mx-4 lg:-mx-8 -my-4 lg:-my-8">
      <div className="flex h-full bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Session List */}
        <div className={`w-full lg:w-80 border-r border-gray-200 flex flex-col ${mobileChatOpen ? "hidden lg:flex" : "flex"}`}>
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-lg font-bold text-gray-900">Chats</h1>
              <span className="text-xs text-gray-400">{mockSessions.length} conversations</span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredSessions.length === 0 ? (
              <EmptyState icon={<MessageSquare className="h-12 w-12" />} title="No chats found" description="Try a different search term" />
            ) : (
              filteredSessions.map((session) => (
                <button
                  key={session.$id}
                  onClick={() => { setSelectedSessionId(session.$id); setMobileChatOpen(true); }}
                  className={`w-full flex items-center gap-3 p-3 text-left transition-colors hover:bg-gray-50 ${selectedSessionId === session.$id ? "bg-brand-50 border-l-3 border-brand-600" : "border-l-3 border-transparent"}`}
                >
                  <Avatar src={session.participantAvatars[1]} name={session.participantNames[1] || "User"} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm truncate ${session.unreadCount > 0 ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                        {session.participantNames[1] || "User"}
                      </p>
                      {session.lastMessageAt && (
                        <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{formatRelative(session.lastMessageAt)}</span>
                      )}
                    </div>
                    <p className={`text-xs truncate mt-0.5 ${session.unreadCount > 0 ? "text-gray-900 font-medium" : "text-gray-500"}`}>
                      {session.lastMessage || "No messages yet"}
                    </p>
                  </div>
                  {session.unreadCount > 0 && (
                    <span className="h-5 min-w-[1.25rem] px-1.5 bg-brand-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {session.unreadCount}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col ${mobileChatOpen ? "flex" : "hidden lg:flex"}`}>
          {selectedSession ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                <button onClick={() => setMobileChatOpen(false)} className="lg:hidden p-1 text-gray-500 hover:bg-gray-100 rounded">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <Avatar src={selectedSession.participantAvatars[1]} name={otherParticipant} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{otherParticipant}</p>
                  <p className="text-xs text-gray-500">{selectedSession.businessName || "Direct Message"}</p>
                </div>
                <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => {
                  const isMe = msg.senderId === profile?.userId || msg.senderId === "user1";
                  return (
                    <div key={msg.$id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${isMe ? "bg-brand-600 text-white rounded-br-md" : "bg-gray-100 text-gray-800 rounded-bl-md"}`}>
                        <p>{msg.content}</p>
                        <div className={`flex items-center gap-1 mt-1 text-xs ${isMe ? "text-brand-200" : "text-gray-400"}`}>
                          <span>{formatRelative(msg.createdAt)}</span>
                          {isMe && <CheckCheck className="h-3 w-3" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg">
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg">
                    <Image className="h-5 w-5" />
                  </button>
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1 h-10 px-4 rounded-full border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                  />
                  <Button size="icon" onClick={handleSend} disabled={!messageInput.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <EmptyState icon={<MessageSquare className="h-12 w-12" />} title="Select a chat" description="Choose a conversation from the list to start messaging" />
          )}
        </div>
      </div>
    </div>
  );
}
