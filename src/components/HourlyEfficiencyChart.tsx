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
import type { HourBucket } from "@/lib/types";

type Props = { hours: HourBucket[] };

export function HourlyEfficiencyChart({ hours }: Props) {
  /** Stacked-bar shift activity: working / not working / device off per clock hour.
   * Mirrors the working/notWorking/deviceOff percentages produced by
   * `build_shift_activity` in core/dal/product/report_v1/_timeline.py. */
  const data = hours.map((h) => ({
    hour: h.hour_label,
    Working: h.working_pct,
    Idle: h.not_working_pct,
    "Device off": h.device_off_pct,
  }));

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-sm font-semibold tracking-tight">
            Hourly efficiency
          </div>
          <div className="text-xs text-[var(--muted)] mt-0.5">
            How each hour of the 10-hour shift was spent across all workers
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-[var(--muted)]">
          <span className="flex items-center gap-1.5">
            <span className="dot" style={{ background: "var(--good)" }} /> Working
          </span>
          <span className="flex items-center gap-1.5">
            <span className="dot" style={{ background: "var(--bad)" }} /> Idle
          </span>
          <span className="flex items-center gap-1.5">
            <span className="dot" style={{ background: "var(--off)" }} /> Device off
          </span>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
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
              tickFormatter={(v) => `${v}%`}
              domain={[0, 100]}
            />
            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.04)" }}
              contentStyle={{
                background: "#fff",
                border: "1px solid var(--border)",
                borderRadius: 10,
                fontSize: 12,
              }}
              formatter={(v) => `${Number(v).toFixed(1)}%`}
            />
            <Bar dataKey="Working" stackId="a" fill="var(--good)" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Idle" stackId="a" fill="var(--bad)" />
            <Bar dataKey="Device off" stackId="a" fill="var(--off)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
