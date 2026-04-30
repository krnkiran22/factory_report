"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import type { CardInventory } from "@/lib/types";
import { fmtInt } from "@/lib/format";

type Props = { inventory: CardInventory; deviceCount: number };

export function CardInventoryPanel({ inventory, deviceCount }: Props) {
  /** SD card health donut + status rows. Mirrors columns from
   * metrics.source_card_inventory_summary (good/bad/empty/claimed/actual). */
  const slices = [
    { name: "Good", value: inventory.good_card_count, color: "var(--good)" },
    { name: "Empty", value: inventory.empty_card_count, color: "var(--off)" },
    { name: "Bad", value: inventory.bad_card_count, color: "var(--bad)" },
  ];
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  const goodPct = (inventory.good_card_count / total) * 100;

  const reconciliationPct =
    inventory.claimed_card_count > 0
      ? (inventory.actual_card_count / inventory.claimed_card_count) * 100
      : 0;

  return (
    <div className="card p-4 sm:p-5 h-full flex flex-col">
      <div className="text-sm font-semibold tracking-tight">SD card health</div>
      <div className="text-xs text-[var(--muted)] mt-0.5">
        End-of-shift inventory across {fmtInt(deviceCount)} devices
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="relative h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={slices}
                dataKey="value"
                innerRadius="60%"
                outerRadius="98%"
                paddingAngle={3}
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
                Healthy
              </div>
              <div className="kpi-value text-xl font-semibold">
                {Math.round(goodPct)}%
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-2.5 text-sm">
          {slices.map((s) => (
            <Row
              key={s.name}
              dot={s.color}
              label={s.name}
              value={fmtInt(s.value)}
              percent={(s.value / total) * 100}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-[var(--border)] grid grid-cols-2 gap-3 text-xs">
        <div>
          <div className="text-[var(--muted)]">Claimed</div>
          <div className="kpi-value text-base font-semibold mt-0.5">
            {fmtInt(inventory.claimed_card_count)}
          </div>
        </div>
        <div>
          <div className="text-[var(--muted)]">Reconciled</div>
          <div className="kpi-value text-base font-semibold mt-0.5">
            {Math.round(reconciliationPct)}%
          </div>
          <div className="text-[10px] text-[var(--muted)]">
            {fmtInt(inventory.actual_card_count)} of {fmtInt(inventory.claimed_card_count)}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  dot,
  label,
  value,
  percent,
}: {
  dot: string;
  label: string;
  value: string;
  percent: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 font-medium">
          <span className="dot" style={{ background: dot }} />
          {label}
        </span>
        <span className="tabular text-[var(--muted)]">{value}</span>
      </div>
      <div className="mt-1 h-1 rounded-full bg-[var(--surface-muted)] overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${percent}%`, background: dot }}
        />
      </div>
    </div>
  );
}
