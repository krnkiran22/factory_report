"use client";

import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";
import { fmtPct, efficiencyTier } from "@/lib/format";

type Props = {
  value: number;
  label?: string;
};

export function EfficiencyGauge({ value, label = "Efficiency" }: Props) {
  /** Radial gauge for the hero efficiency %. Renders a 270° arc with a center
   * value and tier badge. Uses tier color from `efficiencyTier`. Sized via
   * clamp() so it shrinks gracefully on phones (~160px) and grows on desktops. */
  const clamped = Math.max(0, Math.min(100, value));
  const tier = efficiencyTier(clamped);
  const data = [{ name: "v", value: clamped, fill: tier.color }];
  return (
    <div
      className="relative grid place-items-center"
      style={{
        width: "clamp(150px, 44vw, 220px)",
        height: "clamp(150px, 44vw, 220px)",
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="78%"
          outerRadius="100%"
          startAngle={225}
          endAngle={-45}
          data={data}
          barSize={14}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar
            dataKey="value"
            cornerRadius={10}
            background={{ fill: "var(--surface-muted)" }}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 grid place-items-center pointer-events-none">
        <div className="text-center">
          <div className="kpi-value text-3xl sm:text-4xl font-semibold tracking-tight">
            {fmtPct(clamped)}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-[var(--muted)] mt-0.5">
            {label}
          </div>
          <div
            className="mt-2 inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: tier.bg, color: tier.color }}
          >
            {tier.label}
          </div>
        </div>
      </div>
    </div>
  );
}
