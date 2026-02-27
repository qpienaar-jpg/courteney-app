"use client";

import { useState } from "react";
import { Download, FileText, Printer } from "lucide-react";
import { format, subDays } from "date-fns";
import { SYMPTOM_CATEGORIES } from "@/lib/ai/symptom-categories";
import type { CategoryKey } from "@/lib/ai/symptom-categories";
import { getSeverityLabel, getSeverityColor } from "@/lib/utils/severity";

interface ExportData {
  dateRange: { start: string; end: string };
  symptoms: {
    id: string;
    name: string;
    category: string;
    severity: number | null;
    frequency: string | null;
    bodyArea: string | null;
    triggers: string[];
    associatedSymptoms: string[];
    notes: string | null;
    date: string;
    onsetDate: string | null;
  }[];
  stats: {
    totalLogged: number;
    averageSeverity: number;
    topCategory: string;
    topTriggers: { name: string; count: number }[];
    categoryCounts: Record<string, number>;
  };
  patterns: { description: string; confidence: number }[];
  generatedAt: string;
}

export default function ExportPage() {
  const [startDate, setStartDate] = useState(
    format(subDays(new Date(), 90), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [data, setData] = useState<ExportData | null>(null);
  const [loading, setLoading] = useState(false);

  const generateSummary = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startDate, endDate }),
      });
      const json = await res.json();
      setData(json);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6 no-print">
        <h1 className="text-2xl font-display font-semibold text-gray-900">
          Clinician Summary
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Generate a summary of your symptom history to share with your healthcare provider
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6 no-print">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">From</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-courteney-purple-400"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">To</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-courteney-purple-400"
            />
          </div>
          <button
            onClick={generateSummary}
            disabled={loading}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            <FileText className="w-4 h-4" />
            {loading ? "Generating..." : "Generate Summary"}
          </button>
          {data && (
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
          )}
        </div>
      </div>

      {/* Summary Preview */}
      {data && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 print:shadow-none print:border-0 print:p-0">
          {/* Header */}
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h2 className="text-xl font-display font-semibold text-courteney-purple-600">
              Courteney — Symptom Summary
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Prepared: {format(new Date(data.generatedAt), "MMMM d, yyyy")}
            </p>
            <p className="text-sm text-gray-500">
              Period: {data.dateRange.start} to {data.dateRange.end}
            </p>
          </div>

          {/* Overview */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Overview
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xl font-semibold text-gray-900">{data.stats.totalLogged}</p>
                <p className="text-xs text-gray-500">Symptoms logged</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xl font-semibold text-gray-900">{data.stats.averageSeverity}/10</p>
                <p className="text-xs text-gray-500">Average severity</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xl font-semibold text-gray-900">
                  {SYMPTOM_CATEGORIES[data.stats.topCategory as CategoryKey]?.label ?? data.stats.topCategory}
                </p>
                <p className="text-xs text-gray-500">Most common category</p>
              </div>
            </div>
          </div>

          {/* Top triggers */}
          {data.stats.topTriggers.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                Top Triggers
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.stats.topTriggers.map((t) => (
                  <span
                    key={t.name}
                    className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm"
                  >
                    {t.name} ({t.count}x)
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Symptom detail table */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Symptom Detail
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 pr-4 text-xs text-gray-500 font-medium">Date</th>
                    <th className="text-left py-2 pr-4 text-xs text-gray-500 font-medium">Symptom</th>
                    <th className="text-left py-2 pr-4 text-xs text-gray-500 font-medium">Category</th>
                    <th className="text-left py-2 pr-4 text-xs text-gray-500 font-medium">Severity</th>
                    <th className="text-left py-2 pr-4 text-xs text-gray-500 font-medium">Frequency</th>
                    <th className="text-left py-2 text-xs text-gray-500 font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {data.symptoms.map((s) => (
                    <tr key={s.id} className="border-b border-gray-50">
                      <td className="py-2 pr-4 text-gray-600 whitespace-nowrap">{s.date}</td>
                      <td className="py-2 pr-4 font-medium text-gray-900">{s.name}</td>
                      <td className="py-2 pr-4 text-gray-600">
                        {SYMPTOM_CATEGORIES[s.category as CategoryKey]?.label ?? s.category}
                      </td>
                      <td className="py-2 pr-4">
                        {s.severity !== null ? (
                          <span className={getSeverityColor(s.severity)}>
                            {s.severity}/10 ({getSeverityLabel(s.severity)})
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="py-2 pr-4 text-gray-600">{s.frequency ?? "—"}</td>
                      <td className="py-2 text-gray-500 text-xs max-w-xs truncate">
                        {s.notes ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Patterns */}
          {data.patterns.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                Identified Patterns
              </h3>
              <ul className="space-y-2">
                {data.patterns.map((p, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-courteney-purple-500 mt-1">•</span>
                    <span>
                      {p.description}{" "}
                      <span className="text-xs text-gray-400">
                        ({Math.round(p.confidence * 100)}% confidence)
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Disclaimer */}
          <div className="border-t border-gray-200 pt-4 mt-8">
            <p className="text-xs text-gray-400 leading-relaxed">
              This summary is generated from self-reported symptom data collected via the
              Courteney health tracking app. It is intended for informational purposes only
              and does not constitute medical advice, diagnosis, or treatment. Please
              discuss these findings with your healthcare provider for professional medical guidance.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
