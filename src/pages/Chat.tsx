import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, Bot, User, Sparkles } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { GraffitiHeader } from "@/components/ui/GraffitiHeader";
import { NeonButton } from "@/components/ui/NeonButton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Yo what's good! 🔥 I'm Leo, your street art AI homie. Need a sick hoodie design? Custom keychain with audio? Drop your ideas and let's create something fire! 🎨",
    timestamp: new Date(),
  },
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Prepare messages for API (excluding timestamps and ids)
    const apiMessages = [...messages, userMessage].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    let assistantContent = "";

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/leo-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages: apiMessages }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Chat failed");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No response stream");

      // Create the assistant message
      const assistantId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "", timestamp: new Date() },
      ]);

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process SSE lines
        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: assistantContent } : m
                )
              );
            }
          } catch {
            // Incomplete JSON, put back and wait
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast.error(error instanceof Error ? error.message : "Chat failed", {
        style: { background: "#0A0A0A", border: "2px solid #FF00FF", color: "#FF00FF" },
      });

      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Yo my bad, something went wrong. Try again? 💀",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="flex flex-col h-[calc(100vh-6rem)]">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <GraffitiHeader size="sm" glowColor="cyan">
            <span className="flex items-center gap-2">
              <Bot className="text-neon-green" />
              AI Chat
              <Sparkles size={16} className="text-neon-yellow animate-pulse" />
            </span>
          </GraffitiHeader>
          <p className="text-muted-foreground font-mono text-sm mt-1">
            Powered by Lovable AI • Your street art design assistant
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 ${
                    message.role === "user"
                      ? "bg-neon-green/20 border-2 border-neon-green/50 ml-8"
                      : "bg-card border-2 border-neon-cyan/30 mr-8"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {message.role === "assistant" ? (
                      <div className="w-6 h-6 rounded-full bg-neon-cyan/20 flex items-center justify-center">
                        <Bot size={14} className="text-neon-cyan" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-neon-green/20 flex items-center justify-center">
                        <User size={14} className="text-neon-green" />
                      </div>
                    )}
                    <span className="text-xs text-muted-foreground font-mono">
                      {message.role === "assistant" ? "Leo AI" : "You"}
                    </span>
                  </div>
                  <p className="font-mono text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          <AnimatePresence>
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 text-neon-cyan"
              >
                <Bot size={16} />
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="w-2 h-2 bg-neon-cyan rounded-full"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="px-4 pb-2">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {["Design a neon skull hoodie", "Create a cyber tiger jacket", "Suggest hype playlist", "Neonify my photo"].map(
              (action) => (
                <button
                  key={action}
                  onClick={() => setInput(action)}
                  disabled={isLoading}
                  className="px-3 py-1.5 bg-muted rounded-full text-xs font-mono text-muted-foreground hover:text-neon-green hover:border-neon-green border border-transparent transition-all whitespace-nowrap disabled:opacity-50"
                >
                  {action}
                </button>
              )
            )}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border bg-card/50 backdrop-blur-lg">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your message..."
                disabled={isLoading}
                className="w-full px-4 py-3 bg-muted border-2 border-border rounded-xl font-mono text-sm focus:outline-none focus:border-neon-green focus:box-glow-green transition-all disabled:opacity-50"
              />
            </div>
            <button
              className="p-3 bg-muted rounded-xl border-2 border-border text-muted-foreground hover:text-neon-magenta hover:border-neon-magenta transition-all"
            >
              <Mic size={20} />
            </button>
            <NeonButton
              variant="green"
              size="sm"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-4"
            >
              <Send size={20} />
            </NeonButton>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
