"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
    }
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    // Reset textarea height after sending
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-2">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Describe your symptoms..."
        disabled={disabled}
        rows={1}
        className="flex-1 resize-none rounded-xl border border-gray-200 bg-courteney-warm-50 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:border-courteney-purple-300 focus:outline-none focus:ring-2 focus:ring-courteney-purple-100 disabled:opacity-50 transition-colors"
      />
      <button
        type="button"
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        className="flex-shrink-0 rounded-xl bg-courteney-purple-600 p-3 text-white transition-colors hover:bg-courteney-purple-700 disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Send message"
      >
        <Send className="h-4 w-4" />
      </button>
    </div>
  );
}
