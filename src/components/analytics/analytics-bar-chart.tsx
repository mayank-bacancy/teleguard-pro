"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function AnalyticsBarChart({
  title,
  eyebrow,
  data,
  color,
}: {
  title: string;
  eyebrow: string;
  data: Array<{ label: string; value: number }>;
  color: string;
}) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-5 backdrop-blur">
      <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-200/80">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-white">{title}</h2>
      <div className="mt-6 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 18 }}>
            <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" horizontal={false} />
            <XAxis
              type="number"
              stroke="rgba(148, 163, 184, 0.6)"
              tick={{ fill: "rgba(148, 163, 184, 0.75)", fontSize: 11 }}
            />
            <YAxis
              type="category"
              dataKey="label"
              width={120}
              stroke="rgba(148, 163, 184, 0.6)"
              tick={{ fill: "rgba(148, 163, 184, 0.75)", fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(7, 14, 20, 0.92)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px",
                color: "#e2e8f0",
              }}
            />
            <Bar dataKey="value" fill={color} radius={[0, 12, 12, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
