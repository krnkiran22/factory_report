"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import type { HourBucket } from "@/lib/types";
import { fmtMinutes } from "@/lib/format";

type Props = { hours: HourBucket[] };

export function TimeDistributionDonut({ hours }: Props) {
  /** Donut breakdown of the full shift into Working / Idle / Device-off minutes
   * with totals and percentages — same numbers the hourly stacked bar shows,
   * aggregated across the day. */
  const totals = hours.reduce(
    (acc, h) => {
      acc.working += h.good_minutes;
      acc.idle += h.bad_minutes;
      acc.off += h.off_minutes;
      return acc;
    },
    { working: 0, idle: 0, off: 0 },
  );
  const total = totals.working + totals.idle + totals.off || 1;
  const slices = [
    { name: "Productive", value: totals.working, color: "var(--good)" },
    { name: "Idle", value: totals.idle, color: "var(--bad)" },
    { name: "Device off", value: totals.off, color: "var(--off)" },
  ];

  return (
    <div className="card p-4 sm:p-5 h-full">
      <div className="text-sm font-semibold tracking-tight">
        Where the day went
      </div>
      <div className="text-xs text-[var(--muted)] mt-0.5">
        Total worker-minutes split by productive, idle, and device-off time
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4 items-center">
        <div className="relative h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={slices}
                dataKey="value"
                innerRadius="62%"
                outerRadius="98%"
                paddingAngle={2}
                stroke="none"
              >
                {slices.map((s, i) => (
                  <Cell key={i} fill={s.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 grid place-items-center pointer-events-none">
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-wider text-[var(--muted)]">
                Productive
              </div>
              <div className="kpi-value text-xl font-semibold">
                {Math.round((totals.working / total) * 100)}%
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-2.5">
          {slices.map((s) => {
            const pct = (s.value / total) * 100;
            return (
              <div key={s.name}>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="dot" style={{ background: s.color }} />
                    {s.name}
                  </span>
                  <span className="tabular text-[var(--muted)]">
                    {fmtMinutes(s.value)}
                  </span>
                </div>
                <div className="mt-1 h-1 rounded-full bg-[var(--surface-muted)] overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, background: s.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
