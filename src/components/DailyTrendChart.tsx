"use client";

import { format, parseISO } from "date-fns";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DailyTrendPoint } from "@/lib/types";
import { fmtHours, fmtPct } from "@/lib/format";

type Props = { trend: DailyTrendPoint[] };

export function DailyTrendChart({ trend }: Props) {
  /** 7-day combined trend: stacked good/bad hours bars + efficiency line on
   * a secondary axis. Single chart instead of two for tighter layout. */
  const totalGood = trend.reduce((s, d) => s + d.good_hours, 0);
  const totalBad = trend.reduce((s, d) => s + d.bad_hours, 0);
  const avgEff = trend.reduce((s, d) => s + d.quality_pct, 0) / Math.max(1, trend.length);
  const data = trend.map((d) => ({
    label: format(parseISO(d.date), "EEE dd"),
    Good: d.good_hours,
    Bad: d.bad_hours,
    Efficiency: d.quality_pct,
  }));

  return (
    <div className="card p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between flex-wrap gap-3 mb-3">
        <div>
          <div className="text-sm font-semibold tracking-tight">
            Last 7 days · combined trend
          </div>
          <div className="text-xs text-[var(--muted)] mt-0.5">
            Stacked hours per day with overlaid efficiency line
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 w-full sm:w-auto sm:flex">
          <Stat label="Total good" value={fmtHours(totalGood)} color="var(--good)" />
          <Stat label="Total idle" value={fmtHours(totalBad)} color="var(--bad)" />
          <Stat label="Avg efficiency" value={fmtPct(avgEff)} color="var(--accent)" />
        </div>
      </div>
      <div className="h-60 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="effLine" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.18} />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#eef0eb" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="#9a9a9a"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="hours"
              stroke="#9a9a9a"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={36}
              tickFormatter={(v) => `${v}h`}
            />
            <YAxis
              yAxisId="pct"
              orientation="right"
              stroke="#9a9a9a"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={36}
              tickFormatter={(v) => `${v}%`}
              domain={[0, 100]}
            />
            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.04)" }}
              contentStyle={{
                background: "#fff",
                border: "1px solid var(--border)",
                borderRadius: 12,
                boxShadow: "var(--shadow-md)",
                fontSize: 12,
              }}
            />
            <Bar yAxisId="hours" dataKey="Good" stackId="b" fill="var(--good)" />
            <Bar
              yAxisId="hours"
              dataKey="Bad"
              stackId="b"
              fill="var(--bad)"
              radius={[6, 6, 0, 0]}
            />
            <Area
              yAxisId="pct"
              type="monotone"
              dataKey="Efficiency"
              stroke="transparent"
              fill="url(#effLine)"
              isAnimationActive={false}
            />
            <Line
              yAxisId="pct"
              type="monotone"
              dataKey="Efficiency"
              stroke="var(--accent)"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "var(--accent)", stroke: "#fff", strokeWidth: 1.5 }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-2.5 py-2 sm:px-3 min-w-0">
      <div className="text-[9px] uppercase tracking-wider text-[var(--muted)] flex items-center gap-1.5">
        <span className="dot shrink-0" style={{ background: color }} />
        <span className="truncate">{label}</span>
      </div>
      <div className="kpi-value text-sm font-semibold mt-0.5 truncate">{value}</div>
    </div>
  );
}
