"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { HourBucket } from "@/lib/types";

type Props = { hours: HourBucket[]; goodHours: number };

export function HourlyEfficiencyChart({ hours, goodHours }: Props) {
  /** Hero chart: stacked bars (working/idle/off %) with overlaid quality line.
   * One row per clock hour of the 10-hour shift. Mirrors `build_shift_activity`
   * in core/dal/product/report_v1/_timeline.py. */
  const peakHour = hours.reduce(
    (best, h) => (h.working_pct > best.working_pct ? h : best),
    hours[0],
  );
  const trough = hours.reduce(
    (worst, h) => (h.working_pct < worst.working_pct ? h : worst),
    hours[0],
  );
  const data = hours.map((h) => ({
    hour: h.hour_label,
    Working: h.working_pct,
    Idle: h.not_working_pct,
    "Device off": h.device_off_pct,
    quality: h.working_pct,
  }));

  return (
    <div className="card-elevated p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
        <div>
          <div className="text-sm font-semibold tracking-tight">
            Hourly efficiency
          </div>
          <div className="text-xs text-[var(--muted)] mt-0.5">
            Working / idle / device-off split per hour with quality overlay
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[var(--muted)]">
          <Legend dot="var(--good)" label="Working" />
          <Legend dot="var(--bad)" label="Idle" />
          <Legend dot="var(--off)" label="Device off" />
          <Legend dot="var(--accent)" label="Quality" line />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-3 mb-3">
        <Stat label="Peak hour" value={peakHour.hour_label} sub={`${peakHour.working_pct.toFixed(0)}% working`} color="var(--good)" />
        <Stat label="Lowest hour" value={trough.hour_label} sub={`${trough.working_pct.toFixed(0)}% working`} color="var(--bad)" />
        <Stat label="Total good" value={`${goodHours.toFixed(1)}h`} sub="Across all workers" color="var(--info)" />
      </div>

      <div className="h-64 sm:h-72 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="workingGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--good)" stopOpacity={0.95} />
                <stop offset="100%" stopColor="var(--good)" stopOpacity={0.7} />
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
              yAxisId="pct"
              stroke="#9a9a9a"
              fontSize={11}
              tickLine={false}
              axisLine={false}
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
              formatter={(v) => `${Number(v).toFixed(1)}%`}
            />
            <Bar yAxisId="pct" dataKey="Working" stackId="a" fill="url(#workingGrad)" />
            <Bar yAxisId="pct" dataKey="Idle" stackId="a" fill="var(--bad)" />
            <Bar yAxisId="pct" dataKey="Device off" stackId="a" fill="var(--off)" radius={[8, 8, 0, 0]} />
            <Line
              yAxisId="pct"
              dataKey="quality"
              type="monotone"
              stroke="var(--accent)"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "var(--accent)", stroke: "#fff", strokeWidth: 1.5 }}
              activeDot={{ r: 5 }}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Legend({ dot, label, line }: { dot: string; label: string; line?: boolean }) {
  return (
    <span className="flex items-center gap-1.5">
      {line ? (
        <span
          className="inline-block h-[2px] w-3 rounded-full"
          style={{ background: dot }}
        />
      ) : (
        <span className="dot" style={{ background: dot }} />
      )}
      {label}
    </span>
  );
}

function Stat({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-2.5 py-2 sm:px-3 sm:py-2.5 min-w-0">
      <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[var(--muted)] flex items-center gap-1.5">
        <span className="dot shrink-0" style={{ background: color }} />
        <span className="truncate">{label}</span>
      </div>
      <div className="kpi-value text-sm sm:text-base font-semibold mt-0.5 truncate">{value}</div>
      <div className="text-[10px] sm:text-[11px] text-[var(--muted)] truncate">{sub}</div>
    </div>
  );
}
