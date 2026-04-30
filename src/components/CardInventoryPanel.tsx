import type { CardInventory } from "@/lib/types";
import { fmtInt } from "@/lib/format";

type Props = { inventory: CardInventory; deviceCount: number };

export function CardInventoryPanel({ inventory, deviceCount }: Props) {
  /** SD card inventory snapshot — mirrors the columns from
   * metrics.source_card_inventory_summary (good/bad/empty/claimed/actual). */
  const rows: Array<{
    label: string;
    value: number;
    color: string;
    note?: string;
  }> = [
    {
      label: "Good cards",
      value: inventory.good_card_count,
      color: "var(--good)",
      note: "Readable, content present",
    },
    {
      label: "Empty cards",
      value: inventory.empty_card_count,
      color: "var(--off)",
      note: "Plugged in, no usable footage",
    },
    {
      label: "Bad cards",
      value: inventory.bad_card_count,
      color: "var(--bad)",
      note: "Read errors / unrecoverable",
    },
    {
      label: "Claimed",
      value: inventory.claimed_card_count,
      color: "var(--info)",
      note: `Issued to ${fmtInt(deviceCount)} devices`,
    },
    {
      label: "Actually returned",
      value: inventory.actual_card_count,
      color: "var(--accent)",
    },
  ];

  return (
    <div className="card p-5">
      <div className="text-sm font-semibold tracking-tight">
        SD card inventory
      </div>
      <div className="text-xs text-[var(--muted)] mt-0.5 mb-4">
        End-of-shift count by status
      </div>
      <div className="space-y-3">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="dot" style={{ background: r.color }} />
              <div>
                <div className="text-sm font-medium">{r.label}</div>
                {r.note && (
                  <div className="text-[11px] text-[var(--muted)]">{r.note}</div>
                )}
              </div>
            </div>
            <div className="text-base tabular-nums font-semibold">
              {fmtInt(r.value)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
