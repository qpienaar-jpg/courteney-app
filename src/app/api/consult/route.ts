import { streamText, convertToModelMessages } from "ai";
import { openai } from "@ai-sdk/openai";
import { prisma } from "@/lib/db";
import { CONSULTATION_SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import { createConsultationTools } from "@/lib/ai/tools";

export async function POST(req: Request) {
  const { messages, consultationId: incomingId } = await req.json();

  // Find existing or create a new consultation
  let consultationId = incomingId;

  if (consultationId) {
    const existing = await prisma.consultation.findUnique({
      where: { id: consultationId },
    });
    if (!existing) {
      consultationId = null;
    }
  }

  if (!consultationId) {
    const consultation = await prisma.consultation.create({
      data: { status: "active" },
    });
    consultationId = consultation.id;
  }

  // Save the latest user message
  const lastMessage = messages[messages.length - 1];
  if (lastMessage && lastMessage.role === "user") {
    const textContent =
      typeof lastMessage.content === "string"
        ? lastMessage.content
        : Array.isArray(lastMessage.parts)
          ? lastMessage.parts
              .filter((p: { type: string }) => p.type === "text")
              .map((p: { text: string }) => p.text)
              .join("")
          : "";

    if (textContent) {
      await prisma.message.create({
        data: {
          consultationId,
          role: "user",
          content: textContent,
        },
      });
    }
  }

  // Create tools with consultationId bound in the closure
  const tools = createConsultationTools(consultationId);

  // Convert UIMessage[] (from useChat) to ModelMessage[] (for streamText)
  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: openai("gpt-4o"),
    system: CONSULTATION_SYSTEM_PROMPT,
    messages: modelMessages,
    tools,
    onFinish: async ({ text }) => {
      if (text) {
        await prisma.message.create({
          data: {
            consultationId,
            role: "assistant",
            content: text,
          },
        });
      }
    },
  });

  return result.toUIMessageStreamResponse({
    headers: {
      "X-Consultation-Id": consultationId,
    },
  });
}
