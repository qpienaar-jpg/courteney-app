import ChatContainer from "@/components/chat/ChatContainer";

export const metadata = {
  title: "Symptom Consultation | Courteney",
  description:
    "Talk with Courteney to log and track your reproductive health symptoms.",
};

export default function ConsultPage() {
  return (
    <main className="pt-20 pb-4">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 mb-4">
        <h1 className="font-display text-2xl font-bold text-gray-900">
          Symptom Consultation
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Describe your symptoms and I&apos;ll help you log them for tracking.
        </p>
      </div>
      <ChatContainer />
    </main>
  );
}
