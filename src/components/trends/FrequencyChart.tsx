"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

interface FrequencyChartProps {
  data: Record<string, number>;
}

export function FrequencyChart({ data }: FrequencyChartProps) {
  const chartData = Object.entries(data)
    .map(([date, count]) => ({
      date,
      label: format(new Date(date), "MMM d"),
      count,
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
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            axisLine={{ stroke: "#e5e7eb" }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            axisLine={{ stroke: "#e5e7eb" }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
            }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#a855f7"
            strokeWidth={2}
            dot={{ r: 4, fill: "#a855f7" }}
            activeDot={{ r: 6 }}
            name="Symptoms"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
