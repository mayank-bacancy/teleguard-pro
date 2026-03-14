"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type AnalyticsTrendChartProps = {
  data: Array<{
    bucket: string;
    calls: number;
    suspicious: number;
    alerts: number;
    blocks: number;
  }>;
};

export function AnalyticsTrendChart({ data }: AnalyticsTrendChartProps) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-5 backdrop-blur">
      <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-200/80">
        Historical trends
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-white">
        Traffic, alerting, and containment over time
      </h2>
      <div className="mt-6 h-96">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
            <XAxis
              dataKey="bucket"
              stroke="rgba(148, 163, 184, 0.6)"
              tick={{ fill: "rgba(148, 163, 184, 0.75)", fontSize: 11 }}
            />
            <YAxis
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
            <Area
              type="monotone"
              dataKey="calls"
              stroke="#38bdf8"
              fill="rgba(56, 189, 248, 0.16)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="suspicious"
              stroke="#f59e0b"
              fill="rgba(245, 158, 11, 0.16)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="alerts"
              stroke="#fb7185"
              fill="rgba(251, 113, 133, 0.14)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="blocks"
              stroke="#34d399"
              fill="rgba(52, 211, 153, 0.14)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
