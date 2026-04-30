"use client";

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { WorkerHistogramBucket } from "@/lib/types";

type Props = { buckets: WorkerHistogramBucket[] };

export function WorkerHistogram({ buckets }: Props) {
  /** Histogram of workers grouped by productivity %. Color-coded bars from red→green
   * make poor / excellent buckets readable at a glance. */
  return (
    <div className="card p-5">
      <div className="text-sm font-semibold tracking-tight">
        Worker productivity distribution
      </div>
      <div className="text-xs text-[var(--muted)] mt-0.5 mb-3">
        How workers are spread across productivity bands today
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={buckets} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="label"
              stroke="#9a9a9a"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#9a9a9a"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={28}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.04)" }}
              contentStyle={{
                background: "#fff",
                border: "1px solid var(--border)",
                borderRadius: 10,
                fontSize: 12,
              }}
              formatter={(v) => [`${v} workers`, "Count"]}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {buckets.map((b, i) => (
                <Cell key={i} fill={b.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
