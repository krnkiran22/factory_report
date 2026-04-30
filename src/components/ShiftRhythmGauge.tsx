"use client";

import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";
import type { ShiftRhythm } from "@/lib/types";
import { fmtMinutes } from "@/lib/format";

type Props = { rhythm: ShiftRhythm };

export function ShiftRhythmGauge({ rhythm }: Props) {
  /** Compact circular progress for "how much of the 10h shift has elapsed".
   * Useful for the live ops feel — gauge fills as the day progresses. */
  const data = [
    { name: "v", value: rhythm.pct_complete, fill: "var(--info)" },
  ];
  return (
    <div className="card p-4 sm:p-5 h-full flex flex-col">
      <div className="text-sm font-semibold tracking-tight">Shift rhythm</div>
      <div className="text-xs text-[var(--muted)] mt-0.5">
        10-hour shift progress · 08:00 → 18:00
      </div>
      <div className="flex items-center gap-4 mt-4 flex-1">
        <div className="relative w-24 h-24 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="74%"
              outerRadius="100%"
              startAngle={90}
              endAngle={-270}
              data={data}
              barSize={10}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar
                dataKey="value"
                cornerRadius={8}
                background={{ fill: "var(--surface-muted)" }}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 grid place-items-center pointer-events-none">
            <div className="text-center">
              <div className="kpi-value text-base font-semibold">
                {Math.round(rhythm.pct_complete)}%
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-[var(--muted)]">Elapsed</span>
            <span className="tabular font-medium">
              {fmtMinutes(rhythm.shift_minutes_elapsed)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--muted)]">Remaining</span>
            <span className="tabular font-medium">
              {fmtMinutes(rhythm.shift_minutes_remaining)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--muted)]">Hours done</span>
            <span className="tabular font-medium">
              {rhythm.hours_completed.toFixed(1)} / 10
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
