import type { UIMessage } from "ai";
import SymptomCard from "./SymptomCard";

interface MessageBubbleProps {
  message: UIMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-courteney-pink-50 text-gray-800"
            : "bg-white text-gray-800 shadow-sm ring-1 ring-courteney-purple-100"
        }`}
      >
        {message.parts.map((part, index) => {
          if (part.type === "text") {
            return (
              <div key={index} className="space-y-2">
                {part.text.split("\n").map((line, lineIdx) => (
                  <p key={lineIdx} className={`text-sm leading-relaxed ${!line.trim() ? "h-2" : ""}`}>
                    {line}
                  </p>
                ))}
              </div>
            );
          }

          if (part.type === "tool-invocation") {
            const { toolName, state, args, result } = part.toolInvocation;

            if (toolName === "log_symptom" && state === "result") {
              return (
                <SymptomCard
                  key={part.toolInvocation.toolCallId}
                  name={args.name}
                  severity={args.severity}
                  category={args.category}
                  result={result}
                />
              );
            }

            // Show a loading state for in-progress tool calls
            if (state === "call") {
              return (
                <div
                  key={part.toolInvocation.toolCallId}
                  className="mt-2 flex items-center gap-2 text-xs text-courteney-purple-500"
                >
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-courteney-purple-300 border-t-courteney-purple-600" />
                  Logging symptom...
                </div>
              );
            }

            return null;
          }

          return null;
        })}
      </div>
    </div>
  );
}
