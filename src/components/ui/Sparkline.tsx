"use client";

import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";
import type { KpiSparkPoint } from "@/lib/types";

type Props = {
  points: KpiSparkPoint[];
  color: string;
  height?: number;
  fill?: boolean;
};

export function Sparkline({ points, color, height = 36, fill = true }: Props) {
  /** Tiny, axis-less area chart used inside KPI tiles to show the 7-day trend.
   * Auto-zooms via YAxis domain "dataMin"/"dataMax" so even small deltas read. */
  const data = points.map((p) => ({ value: p.value }));
  const id = `spark-${color.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.45} />
              <stop offset="100%" stopColor={color} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <YAxis hide domain={["dataMin - 1", "dataMax + 1"]} />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.75}
            fill={fill ? `url(#${id})` : "transparent"}
            isAnimationActive={false}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
