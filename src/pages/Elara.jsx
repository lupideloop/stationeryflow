import React, { useEffect, useRef, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot } from "lucide-react";
import MessageBubble from "@/components/elara/MessageBubble";
import ChatInput from "@/components/elara/ChatInput";

export default function Elara() {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      const conv = await base44.agents.createConversation({
        agent_name: "elara",
        metadata: { name: "Elara Inventory Chat", description: "Elara Inventory Chat" },
      });
      setConversation(conv);
      setMessages(conv.messages || []);
    };
    init();
  }, []);

  useEffect(() => {
    if (!conversation) return;
    const unsubscribe = base44.agents.subscribeToConversation(conversation.id, (data) => {
      setMessages(data.messages);
    });
    return () => unsubscribe();
  }, [conversation]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text) => {
    if (!conversation) return;
    setSending(true);
    await base44.agents.addMessage(conversation, { role: "user", content: text });
    setSending(false);
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)]">
      <div className="flex items-center gap-2 mb-4">
        <Bot className="w-6 h-6 text-primary" />
        <h1 className="text-xl font-semibold">Elara — Inventory Assistant</h1>
      </div>
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardHeader className="border-b py-3">
          <CardTitle className="text-sm text-muted-foreground font-normal">
            Ask about stock levels, last purchases, or last transfers for any item.
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto py-4 space-y-4">
          {messages.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              Try: "What's the stock level of A4 paper?" or "When was the last purchase of staples?"
            </p>
          )}
          {messages.map((msg, idx) => (
            <MessageBubble key={idx} message={msg} />
          ))}
          <div ref={bottomRef} />
        </CardContent>
        <div className="border-t p-3">
          <ChatInput onSend={handleSend} disabled={!conversation || sending} />
        </div>
      </Card>
    </div>
  );
}