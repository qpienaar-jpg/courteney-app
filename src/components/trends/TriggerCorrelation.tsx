"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TriggerCorrelationProps {
  data: [string, number][];
}

export function TriggerCorrelation({ data }: TriggerCorrelationProps) {
  const chartData = data.map(([name, count]) => ({ name, count }));

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
        No trigger data available
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis
            type="number"
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            axisLine={{ stroke: "#e5e7eb" }}
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 12, fill: "#6b7280" }}
            axisLine={{ stroke: "#e5e7eb" }}
            width={120}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
            }}
          />
          <Bar
            dataKey="count"
            fill="#f9a8d4"
            radius={[0, 4, 4, 0]}
            name="Occurrences"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
