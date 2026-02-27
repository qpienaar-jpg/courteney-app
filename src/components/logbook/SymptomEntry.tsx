"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Calendar, Activity } from "lucide-react";
import { SYMPTOM_CATEGORIES, BODY_AREAS, FREQUENCY_OPTIONS } from "@/lib/ai/symptom-categories";
import type { CategoryKey } from "@/lib/ai/symptom-categories";
import { getSeverityColor, getSeverityBgColor, getSeverityLabel } from "@/lib/utils/severity";
import { formatSymptomDate } from "@/lib/utils/date";
import { parseJsonArray } from "@/lib/utils/json";

interface SymptomEntryProps {
  symptom: {
    id: string;
    name: string;
    category: string;
    severity: number | null;
    frequency: string | null;
    bodyArea: string | null;
    triggers: string | null;
    associatedSymptoms: string | null;
    notes: string | null;
    createdAt: string;
    onsetDate: string | null;
  };
}

export function SymptomEntry({ symptom }: SymptomEntryProps) {
  const [expanded, setExpanded] = useState(false);

  const cat = SYMPTOM_CATEGORIES[symptom.category as CategoryKey] ?? SYMPTOM_CATEGORIES.other;
  const triggers = parseJsonArray(symptom.triggers);
  const associated = parseJsonArray(symptom.associatedSymptoms);

  return (
    <div
      className={`bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition-all ${
        expanded ? "ring-1 ring-courteney-purple-200" : ""
      }`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors"
      >
        {/* Severity indicator */}
        {symptom.severity !== null && (
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getSeverityBgColor(symptom.severity)} ${getSeverityColor(symptom.severity)}`}
          >
            {symptom.severity}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-gray-900">{symptom.name}</span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cat.color}`}
            >
              {cat.label}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
            <span>{formatSymptomDate(symptom.createdAt)}</span>
            {symptom.severity !== null && (
              <span>{getSeverityLabel(symptom.severity)}</span>
            )}
            {symptom.frequency && (
              <span>
                {FREQUENCY_OPTIONS[symptom.frequency as keyof typeof FREQUENCY_OPTIONS] ?? symptom.frequency}
              </span>
            )}
          </div>
        </div>

        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-50 pt-3 space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-3">
            {symptom.bodyArea && (
              <div>
                <span className="text-gray-500 text-xs">Body Area</span>
                <p className="text-gray-900">
                  {BODY_AREAS[symptom.bodyArea as keyof typeof BODY_AREAS] ?? symptom.bodyArea}
                </p>
              </div>
            )}
            {symptom.onsetDate && (
              <div>
                <span className="text-gray-500 text-xs">Onset</span>
                <p className="text-gray-900 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(symptom.onsetDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {triggers.length > 0 && (
            <div>
              <span className="text-gray-500 text-xs">Triggers</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {triggers.map((t, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-orange-50 text-orange-700 rounded-full text-xs"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {associated.length > 0 && (
            <div>
              <span className="text-gray-500 text-xs">Associated Symptoms</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {associated.map((a, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-courteney-purple-50 text-courteney-purple-600 rounded-full text-xs"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {symptom.notes && (
            <div>
              <span className="text-gray-500 text-xs">Notes</span>
              <p className="text-gray-700 mt-0.5">{symptom.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
