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
import { fmtInt } from "@/lib/format";

type Props = { hours: HourBucket[] };

export function HourlyClipsChart({ hours }: Props) {
  /** Total vs usable clips per hour with totals strip on top. */
  const totals = hours.reduce(
    (acc, h) => {
      acc.total += h.clip_count;
      acc.usable += h.usable_clip_count;
      return acc;
    },
    { total: 0, usable: 0 },
  );
  const yieldPct = totals.total > 0 ? (totals.usable / totals.total) * 100 : 0;
  const data = hours.map((h) => ({
    hour: h.hour_label,
    Total: h.clip_count,
    Usable: h.usable_clip_count,
  }));

  return (
    <div className="card p-4 sm:p-5 h-full">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between flex-wrap gap-2 sm:gap-3">
        <div>
          <div className="text-sm font-semibold tracking-tight">
            Clips per hour
          </div>
          <div className="text-xs text-[var(--muted)] mt-0.5">
            Total uploaded vs passed quality
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center w-full sm:w-auto">
          <Pill label="Total" value={fmtInt(totals.total)} color="var(--info)" />
          <Pill label="Usable" value={fmtInt(totals.usable)} color="var(--good)" />
          <Pill
            label="Yield"
            value={`${yieldPct.toFixed(0)}%`}
            color="var(--accent)"
          />
        </div>
      </div>
      <div className="h-44 sm:h-48 mt-3">
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
            <CartesianGrid stroke="#eef0eb" vertical={false} />
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
                borderRadius: 12,
                boxShadow: "var(--shadow-md)",
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

function Pill({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-2.5 py-1.5">
      <div className="text-[9px] uppercase tracking-wider text-[var(--muted)] flex items-center justify-center gap-1">
        <span className="dot" style={{ background: color }} /> {label}
      </div>
      <div className="kpi-value text-sm font-semibold mt-0.5">{value}</div>
    </div>
  );
}
