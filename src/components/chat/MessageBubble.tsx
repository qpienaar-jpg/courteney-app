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

          if (part.type.startsWith("tool-")) {
            const toolPart = part as { type: string; toolCallId: string; toolName?: string; state: string; input?: Record<string, unknown>; output?: Record<string, unknown> };

            if (toolPart.toolName === "log_symptom" && toolPart.state === "result") {
              const args = (toolPart.input ?? {}) as Record<string, unknown>;
              return (
                <SymptomCard
                  key={toolPart.toolCallId}
                  name={args.name as string}
                  severity={args.severity as number | undefined}
                  category={args.category as string}
                  result={toolPart.output as { success: boolean; symptomId: string; message: string } | undefined}
                />
              );
            }

            // Show a loading state for in-progress tool calls
            if (toolPart.state === "call" || toolPart.state === "input-streaming") {
              return (
                <div
                  key={toolPart.toolCallId}
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
