"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { format } from "date-fns";

interface SeverityChartProps {
  data: Record<string, number>;
}

export function SeverityChart({ data }: SeverityChartProps) {
  const chartData = Object.entries(data)
    .map(([date, severity]) => ({
      date,
      label: format(new Date(date), "MMM d"),
      severity,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
        No data for this period
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="severityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f472b6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f472b6" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            axisLine={{ stroke: "#e5e7eb" }}
          />
          <YAxis
            domain={[0, 10]}
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            axisLine={{ stroke: "#e5e7eb" }}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
            }}
          />
          <ReferenceLine y={5} stroke="#e5e7eb" strokeDasharray="3 3" />
          <Area
            type="monotone"
            dataKey="severity"
            stroke="#f472b6"
            strokeWidth={2}
            fill="url(#severityGradient)"
            name="Avg Severity"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
