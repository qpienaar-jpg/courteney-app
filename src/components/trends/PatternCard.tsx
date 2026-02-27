import { Lightbulb } from "lucide-react";

interface PatternCardProps {
  description: string;
  confidence: number;
}

export function PatternCard({ description, confidence }: PatternCardProps) {
  const pct = Math.round(confidence * 100);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center shrink-0 mt-0.5">
          <Lightbulb className="w-4 h-4 text-yellow-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-courteney-purple-400 rounded-full"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 shrink-0">{pct}% confidence</span>
          </div>
        </div>
      </div>
    </div>
  );
}
