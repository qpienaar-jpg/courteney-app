"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRef, useEffect, useCallback, useMemo } from "react";
import { Heart } from "lucide-react";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";

export default function ChatContainer() {
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/consult",
      }),
    []
  );

  const { messages, sendMessage, status } = useChat({ transport });

  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, status, scrollToBottom]);

  const isLoading = status === "submitted" || status === "streaming";

  const handleSend = (text: string) => {
    sendMessage({ text });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto">
      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scroll-smooth"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="w-16 h-16 rounded-full bg-courteney-purple-100 flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-courteney-purple-500" />
            </div>
            <h2 className="font-display text-xl font-semibold text-gray-800 mb-2">
              Welcome to Courteney
            </h2>
            <p className="text-gray-500 text-sm max-w-md">
              I&apos;m here to help you log and track your reproductive health
              symptoms. Tell me what you&apos;re experiencing, and I&apos;ll
              guide you through capturing the details.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {["Period cramps", "Irregular cycle", "Breast pain", "Fatigue"].map(
                (suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSend(suggestion)}
                    className="rounded-full bg-courteney-purple-50 px-4 py-2 text-sm text-courteney-purple-600 hover:bg-courteney-purple-100 transition-colors"
                  >
                    {suggestion}
                  </button>
                )
              )}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading &&
              messages[messages.length - 1]?.role !== "assistant" && (
                <TypingIndicator />
              )}
          </>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-gray-100 bg-white/80 backdrop-blur-md px-4 py-3">
        <ChatInput onSend={handleSend} disabled={isLoading} />
      </div>
    </div>
  );
}
