export default function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="rounded-2xl bg-white px-5 py-4 shadow-sm ring-1 ring-courteney-purple-100">
        <div className="flex items-center gap-1.5">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      </div>
    </div>
  );
}
