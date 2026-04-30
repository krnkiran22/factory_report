"use client";

import { format, parseISO } from "date-fns";
import type { HeatmapCell } from "@/lib/types";
import { fmtHours, fmtPct } from "@/lib/format";

type Props = { cells: HeatmapCell[] };

function cellColor(pct: number): string {
  /** 5-step ramp from soft red (poor) → green (excellent). */
  if (pct < 20) return "#fee2e2";
  if (pct < 35) return "#fed7aa";
  if (pct < 50) return "#fef3c7";
  if (pct < 65) return "#bbf7d0";
  if (pct < 80) return "#86efac";
  return "#22c55e";
}

export function EfficiencyHeatmap({ cells }: Props) {
  /** GitHub-style efficiency heatmap. 7 rows = days of week (Mon..Sun),
   * columns = weeks. Cells laid out column-major so each column is one week. */
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const earliest = cells[0] ? parseISO(cells[0].date) : null;
  const dayIndexOf = (d: Date) => (d.getDay() + 6) % 7;
  const leadingBlanks = earliest ? dayIndexOf(earliest) : 0;
  const total = leadingBlanks + cells.length;
  const weeks = Math.ceil(total / 7);
  const items: Array<HeatmapCell | null> = [
    ...Array.from<HeatmapCell | null>({ length: leadingBlanks }).fill(null),
    ...cells,
  ];
  while (items.length < weeks * 7) items.push(null);

  return (
    <div className="card p-4 sm:p-5">
      <div className="flex items-end justify-between mb-3 flex-wrap gap-2">
        <div>
          <div className="text-sm font-semibold tracking-tight">
            Efficiency calendar
          </div>
          <div className="text-xs text-[var(--muted)] mt-0.5">
            Last {cells.length} days · darker green = higher efficiency %
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-[var(--muted)]">
          <span>Low</span>
          {[10, 30, 50, 70, 90].map((p) => (
            <span
              key={p}
              className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-[3px]"
              style={{ background: cellColor(p) }}
            />
          ))}
          <span>High</span>
        </div>
      </div>
      <div className="flex gap-2 sm:gap-3 overflow-x-auto scroll-thin -mx-1 px-1">
        <div className="flex flex-col gap-1 sm:gap-1.5 text-[9px] sm:text-[10px] text-[var(--muted)] pt-0.5 shrink-0">
          {dayLabels.map((d) => (
            <div
              key={d}
              className="h-4 sm:h-5 leading-4 sm:leading-5 w-7 sm:w-auto"
            >
              {d}
            </div>
          ))}
        </div>
        <div
          className="grid gap-1 sm:gap-1.5 flex-1 min-w-0"
          style={{
            gridTemplateColumns: `repeat(${weeks}, minmax(14px, 1fr))`,
            gridTemplateRows: "repeat(7, minmax(0, 1fr))",
            gridAutoFlow: "column",
          }}
        >
          {items.map((cell, idx) => {
            if (!cell)
              return (
                <div
                  key={idx}
                  className="h-4 sm:h-5 rounded-[4px] bg-transparent"
                />
              );
            const date = parseISO(cell.date);
            return (
              <div
                key={idx}
                title={`${format(date, "EEE, dd MMM")} · ${fmtPct(cell.efficiency_pct)} · ${fmtHours(cell.good_hours)}`}
                className="h-4 sm:h-5 rounded-[4px] border border-black/[0.04] hover:ring-2 hover:ring-[var(--foreground)]/20 transition cursor-default"
                style={{ background: cellColor(cell.efficiency_pct) }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
