"use client";

import { SymptomEntry } from "./SymptomEntry";
import { isToday, isYesterday, format } from "date-fns";
import { ClipboardList } from "lucide-react";
import Link from "next/link";

interface Symptom {
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
}

interface SymptomTimelineProps {
  symptoms: Symptom[];
  total: number;
  page?: number;
  onLoadMore: () => void;
  loading: boolean;
}

function getDateGroup(dateStr: string): string {
  const date = new Date(dateStr);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMMM d, yyyy");
}

export function SymptomTimeline({
  symptoms,
  total,
  onLoadMore,
  loading,
}: SymptomTimelineProps) {
  if (symptoms.length === 0 && !loading) {
    return (
      <div className="text-center py-16">
        <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-500 mb-2">
          No symptoms logged yet
        </h3>
        <p className="text-sm text-gray-400 mb-6">
          Start a consultation to begin tracking your symptoms
        </p>
        <Link href="/consult" className="btn-primary inline-block">
          Start a Consultation
        </Link>
      </div>
    );
  }

  // Group by date
  const groups: { label: string; symptoms: Symptom[] }[] = [];
  let currentGroup = "";

  symptoms.forEach((s) => {
    const group = getDateGroup(s.createdAt);
    if (group !== currentGroup) {
      currentGroup = group;
      groups.push({ label: group, symptoms: [] });
    }
    groups[groups.length - 1].symptoms.push(s);
  });

  const hasMore = symptoms.length < total;

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.label}>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            {group.label}
          </h3>
          <div className="space-y-2">
            {group.symptoms.map((symptom) => (
              <SymptomEntry key={symptom.id} symptom={symptom} />
            ))}
          </div>
        </div>
      ))}

      {hasMore && (
        <div className="text-center pt-4">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="px-6 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}
