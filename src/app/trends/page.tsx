"use client";

import { useState, useEffect } from "react";
import { Activity, TrendingUp, BarChart3 } from "lucide-react";
import { StatCard } from "@/components/trends/StatCard";
import { FrequencyChart } from "@/components/trends/FrequencyChart";
import { SeverityChart } from "@/components/trends/SeverityChart";
import { TriggerCorrelation } from "@/components/trends/TriggerCorrelation";
import { PatternCard } from "@/components/trends/PatternCard";
import { SYMPTOM_CATEGORIES } from "@/lib/ai/symptom-categories";
import type { CategoryKey } from "@/lib/ai/symptom-categories";

const PERIODS = [
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
  { value: "1y", label: "1 year" },
];

interface TrendData {
  frequencyByDay: Record<string, number>;
  severityByDay: Record<string, number>;
  byCategory: Record<string, number>;
  byBodyArea: Record<string, number>;
  topTriggers: [string, number][];
  totalSymptoms: number;
  averageSeverity: number;
  period: string;
  patterns: { description: string; confidence: number }[];
}

export default function TrendsPage() {
  const [period, setPeriod] = useState("90d");
  const [data, setData] = useState<TrendData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrends() {
      setLoading(true);
      try {
        const res = await fetch(`/api/trends?period=${period}`);
        const json = await res.json();
        setData(json);
      } finally {
        setLoading(false);
      }
    }
    fetchTrends();
  }, [period]);

  const topCategoryKey = data
    ? Object.entries(data.byCategory).sort(([, a], [, b]) => b - a)[0]?.[0]
    : null;
  const topCategoryLabel = topCategoryKey
    ? SYMPTOM_CATEGORIES[topCategoryKey as CategoryKey]?.label ?? topCategoryKey
    : "—";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-semibold text-gray-900">
            Trend Insights
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Patterns and trends from your symptom history
          </p>
        </div>

        <div className="flex bg-white rounded-full border border-gray-200 p-1">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                period === p.value
                  ? "bg-courteney-purple-500 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {loading && !data ? (
        <div className="text-center py-16 text-gray-400">Loading trends...</div>
      ) : data ? (
        <div className="space-y-6">
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              label="Total symptoms logged"
              value={data.totalSymptoms}
              icon={<Activity className="w-5 h-5" />}
            />
            <StatCard
              label="Average severity"
              value={`${data.averageSeverity}/10`}
              icon={<TrendingUp className="w-5 h-5" />}
            />
            <StatCard
              label="Most common category"
              value={topCategoryLabel}
              icon={<BarChart3 className="w-5 h-5" />}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                Symptom Frequency
              </h3>
              <FrequencyChart data={data.frequencyByDay} />
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                Average Severity
              </h3>
              <SeverityChart data={data.severityByDay} />
            </div>
          </div>

          {/* Triggers */}
          {data.topTriggers.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                Top Triggers
              </h3>
              <TriggerCorrelation data={data.topTriggers} />
            </div>
          )}

          {/* Patterns */}
          {data.patterns.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Identified Patterns
              </h3>
              <div className="space-y-3">
                {data.patterns.map((pattern, i) => (
                  <PatternCard
                    key={i}
                    description={pattern.description}
                    confidence={pattern.confidence}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
