import { CheckCircle } from "lucide-react";
import { SYMPTOM_CATEGORIES, type CategoryKey } from "@/lib/ai/symptom-categories";
import { getSeverityColor, getSeverityLabel } from "@/lib/utils/severity";

interface SymptomCardProps {
  name: string;
  severity?: number;
  category: string;
  result?: {
    success: boolean;
    symptomId: string;
    message: string;
  };
}

export default function SymptomCard({
  name,
  severity,
  category,
  result,
}: SymptomCardProps) {
  const categoryKey = category as CategoryKey;
  const categoryInfo = SYMPTOM_CATEGORIES[categoryKey] ?? SYMPTOM_CATEGORIES.other;

  return (
    <div className="mt-3 rounded-xl border border-green-200 bg-green-50/50 p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
        <span className="text-sm font-semibold text-green-700">
          Symptom Logged
        </span>
      </div>

      {/* Symptom name */}
      <p className="text-sm font-medium text-gray-800 mb-2">{name}</p>

      {/* Category badge */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryInfo.color}`}
        >
          {categoryInfo.label}
        </span>

        {/* Severity bar */}
        {severity != null && (
          <div className="flex items-center gap-2">
            <div className="h-2 w-20 rounded-full bg-gray-200 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  severity <= 3
                    ? "bg-green-400"
                    : severity <= 6
                      ? "bg-yellow-400"
                      : severity <= 8
                        ? "bg-orange-400"
                        : "bg-red-400"
                }`}
                style={{ width: `${(severity / 10) * 100}%` }}
              />
            </div>
            <span
              className={`text-xs font-medium ${getSeverityColor(severity)}`}
            >
              {severity}/10 &middot; {getSeverityLabel(severity)}
            </span>
          </div>
        )}
      </div>

      {/* Result message */}
      {result?.success && (
        <p className="mt-2 text-xs text-green-600">{result.message}</p>
      )}
    </div>
  );
}
