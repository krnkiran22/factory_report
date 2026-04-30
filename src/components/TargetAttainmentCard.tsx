"use client";

import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";
import { fmtHours, fmtPct } from "@/lib/format";

type Props = {
  goodHoursPerWorker: number;
  yesterdayPerWorker: number;
  targetHours?: number;
};

const DEFAULT_TARGET = 7;

export function TargetAttainmentCard({
  goodHoursPerWorker,
  yesterdayPerWorker,
  targetHours = DEFAULT_TARGET,
}: Props) {
  /** Owner-centric: how close are we to today's per-worker productive-hours
   * target? Pure derivation from existing fields (good_hours_per_participant
   * vs a target). No new data source required. */
  const attainment = (goodHoursPerWorker / targetHours) * 100;
  const clamped = Math.max(0, Math.min(140, attainment));
  const delta = goodHoursPerWorker - yesterdayPerWorker;
  const status =
    attainment >= 100
      ? { label: "On target", color: "var(--good)", bg: "var(--good-soft)" }
      : attainment >= 80
        ? { label: "Close to target", color: "var(--warn)", bg: "var(--warn-soft)" }
        : { label: "Below target", color: "var(--bad)", bg: "var(--bad-soft)" };

  const arcColor =
    attainment >= 100 ? "var(--good)" : attainment >= 80 ? "var(--warn)" : "var(--bad)";
  const data = [{ name: "v", value: Math.min(100, clamped), fill: arcColor }];

  return (
    <div className="card p-4 sm:p-5 h-full flex flex-col">
      <div className="text-sm font-semibold tracking-tight">
        Target attainment
      </div>
      <div className="text-xs text-[var(--muted)] mt-0.5">
        Productive hours per worker vs daily goal
      </div>

      <div className="grid grid-cols-[auto_1fr] gap-4 items-center mt-4">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0">
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
              <div className="kpi-value text-base sm:text-lg font-semibold">
                {fmtPct(attainment)}
              </div>
              <div className="text-[9px] uppercase tracking-wider text-[var(--muted)]">
                of target
              </div>
            </div>
          </div>
        </div>
        <div className="min-w-0">
          <div className="kpi-value text-2xl sm:text-3xl font-semibold tabular">
            {fmtHours(goodHoursPerWorker)}
          </div>
          <div className="text-[11px] sm:text-xs text-[var(--muted)] mt-0.5">
            of {fmtHours(targetHours)} target / worker
          </div>
          <div
            className="mt-2 inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: status.bg, color: status.color }}
          >
            {status.label}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs">
        <span className="text-[var(--muted)]">vs yesterday</span>
        <span
          className="tabular font-semibold inline-flex items-center gap-1"
          style={{
            color:
              delta > 0
                ? "var(--good-ink)"
                : delta < 0
                  ? "var(--bad-ink)"
                  : "var(--muted)",
          }}
        >
          <span className="text-[8px] leading-none">
            {delta > 0 ? "▲" : delta < 0 ? "▼" : "·"}
          </span>
          {delta >= 0 ? "+" : ""}
          {delta.toFixed(2)}h
        </span>
      </div>
    </div>
  );
}
