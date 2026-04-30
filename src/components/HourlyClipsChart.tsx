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
import type { HourBucket } from "@/lib/types";

type Props = { hours: HourBucket[] };

export function HourlyClipsChart({ hours }: Props) {
  /** Total vs usable clips uploaded each hour — gives a feel for production rhythm
   * and highlights the gap (rejected/non-usable clips) per hour. */
  const data = hours.map((h) => ({
    hour: h.hour_label,
    Total: h.clip_count,
    Usable: h.usable_clip_count,
  }));

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-sm font-semibold tracking-tight">
            Clips per hour
          </div>
          <div className="text-xs text-[var(--muted)] mt-0.5">
            Total uploaded vs usable (passed quality checks)
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-[var(--muted)]">
          <span className="flex items-center gap-1.5">
            <span className="dot" style={{ background: "var(--info)" }} /> Total
          </span>
          <span className="flex items-center gap-1.5">
            <span className="dot" style={{ background: "var(--good)" }} /> Usable
          </span>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="grad-total" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--info)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--info)" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="grad-usable" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--good)" stopOpacity={0.45} />
                <stop offset="100%" stopColor="var(--good)" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#eee" vertical={false} />
            <XAxis
              dataKey="hour"
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
              width={36}
            />
            <Tooltip
              contentStyle={{
                background: "#fff",
                border: "1px solid var(--border)",
                borderRadius: 10,
                fontSize: 12,
              }}
            />
            <Area
              type="monotone"
              dataKey="Total"
              stroke="var(--info)"
              strokeWidth={2}
              fill="url(#grad-total)"
            />
            <Area
              type="monotone"
              dataKey="Usable"
              stroke="var(--good)"
              strokeWidth={2}
              fill="url(#grad-usable)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
