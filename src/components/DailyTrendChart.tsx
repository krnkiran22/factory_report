"use client";

import { format, parseISO } from "date-fns";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DailyTrendPoint } from "@/lib/types";

type Props = { trend: DailyTrendPoint[] };

export function DailyTrendChart({ trend }: Props) {
  /** 7-day trend split into two compact charts: hours (good vs bad) and quality %.
   * Helpful for an operator to spot day-of-week patterns quickly. */
  const data = trend.map((d) => ({
    label: format(parseISO(d.date), "EEE dd"),
    Good: d.good_hours,
    Bad: d.bad_hours,
    Quality: d.quality_pct,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="card p-5">
        <div className="text-sm font-semibold tracking-tight">
          Last 7 days · hours
        </div>
        <div className="text-xs text-[var(--muted)] mt-0.5 mb-3">
          Good hours collected vs idle/bad hours per day
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#eee" vertical={false} />
              <XAxis
                dataKey="label"
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
                tickFormatter={(v) => `${v}h`}
              />
              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.04)" }}
                contentStyle={{
                  background: "#fff",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  fontSize: 12,
                }}
                formatter={(v) => `${Number(v).toFixed(1)}h`}
              />
              <Bar dataKey="Good" stackId="b" fill="var(--good)" />
              <Bar dataKey="Bad" stackId="b" fill="var(--bad)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="card p-5">
        <div className="text-sm font-semibold tracking-tight">
          Last 7 days · efficiency
        </div>
        <div className="text-xs text-[var(--muted)] mt-0.5 mb-3">
          Daily efficiency % across the 10-hour shift
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#eee" vertical={false} />
              <XAxis
                dataKey="label"
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
                tickFormatter={(v) => `${v}%`}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  fontSize: 12,
                }}
                formatter={(v) => `${Number(v).toFixed(1)}%`}
              />
              <Line
                type="monotone"
                dataKey="Quality"
                stroke="var(--accent)"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "var(--accent)" }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
