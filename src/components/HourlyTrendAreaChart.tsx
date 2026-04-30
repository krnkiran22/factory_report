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
import { fmtPct } from "@/lib/format";

type Props = {
  hours: HourBucket[];
  productivePct: number;
};

export function HourlyTrendAreaChart({ hours, productivePct }: Props) {
  /** 100% stacked area trend matching the reference design: smooth curves
   * for working / not-working / device-off shares across the shift, with a
   * tooltip that breaks down all three percentages for the hovered hour. */
  const data = hours.map((h, i) => ({
    hour: `${i}h`,
    Working: Number(h.working_pct.toFixed(1)),
    "Not working": Number(h.not_working_pct.toFixed(1)),
    "Device off": Number(h.device_off_pct.toFixed(1)),
  }));

  return (
    <div className="card-elevated p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-3">
        <div className="min-w-0">
          <div className="kpi-value text-3xl sm:text-4xl font-bold tracking-tight leading-none">
            {fmtPct(productivePct)}{" "}
            <span className="text-base sm:text-lg font-medium text-[var(--muted)] tracking-tight">
              Productive
            </span>
          </div>
          <div className="text-xs text-[var(--muted)] mt-1.5">
            Hour-by-hour split of working, not working, and device-off time
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[var(--muted)]">
          <Legend dot="var(--good)" label="Working" />
          <Legend dot="var(--bad)" label="Not working" />
          <Legend dot="var(--off)" label="Device off" />
        </div>
      </div>

      <div className="h-64 sm:h-80 -mx-1 sm:mx-0">
        <ResponsiveContainer>
          <AreaChart
            data={data}
            margin={{ top: 6, right: 12, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="areaWorking" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--good)" stopOpacity={0.5} />
                <stop offset="100%" stopColor="var(--good)" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="areaNotWorking" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--bad)" stopOpacity={0.45} />
                <stop offset="100%" stopColor="var(--bad)" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="areaOff" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--off)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="var(--off)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke="var(--border)"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="hour"
              tick={{ fontSize: 11, fill: "var(--muted)" }}
              axisLine={false}
              tickLine={false}
              padding={{ left: 0, right: 0 }}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 11, fill: "var(--muted)" }}
              axisLine={false}
              tickLine={false}
              width={36}
            />
            <Tooltip
              cursor={{
                stroke: "var(--foreground)",
                strokeWidth: 1,
                strokeDasharray: "3 3",
              }}
              content={<CustomTooltip />}
            />
            <Area
              type="monotone"
              dataKey="Working"
              stackId="1"
              stroke="var(--good)"
              strokeWidth={2}
              fill="url(#areaWorking)"
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="Not working"
              stackId="1"
              stroke="var(--bad)"
              strokeWidth={2}
              fill="url(#areaNotWorking)"
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="Device off"
              stackId="1"
              stroke="var(--off)"
              strokeWidth={2}
              fill="url(#areaOff)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

type TooltipProps = {
  active?: boolean;
  label?: string;
  payload?: Array<{ dataKey?: string | number; value?: number; color?: string }>;
};

function CustomTooltip({ active, payload, label }: TooltipProps) {
  /** Reads dataKey + value off each payload entry so the tooltip mirrors
   * the reference design: explicit "Working / Not working / Device off"
   * labels alongside their per-hour percentages. */
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-lg border border-[var(--border)] bg-white shadow-lg px-3 py-2 text-xs min-w-[170px]">
      <div className="font-semibold mb-1.5">Hour {label}</div>
      <div className="space-y-1">
        {payload.map((p) => (
          <div
            key={String(p.dataKey)}
            className="flex items-center justify-between gap-4"
          >
            <span className="flex items-center gap-1.5 text-[var(--muted)]">
              <span className="dot" style={{ background: p.color }} />
              {String(p.dataKey)}
            </span>
            <span className="font-semibold tabular">
              {Number(p.value ?? 0).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Legend({ dot, label }: { dot: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="dot" style={{ background: dot }} />
      {label}
    </span>
  );
}
