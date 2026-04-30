import type { NetworkComparison } from "@/lib/types";
import { fmtHours, fmtPct } from "@/lib/format";

type Props = { comparison: NetworkComparison };

export function NetworkComparisonCard({ comparison }: Props) {
  /** Side-by-side comparison: this factory vs network avg vs network top.
   * Displays the rank prominently as "X / N". */
  const top = comparison.network_top_efficiency_pct;
  const factoryWidth = top > 0 ? (comparison.factory_efficiency_pct / top) * 100 : 0;
  const avgWidth = top > 0 ? (comparison.network_avg_efficiency_pct / top) * 100 : 0;

  return (
    <div className="card p-5 h-full">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-semibold tracking-tight">
            Network ranking
          </div>
          <div className="text-xs text-[var(--muted)] mt-0.5">
            How this factory compares to all sites today
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wider text-[var(--muted)]">
            Rank
          </div>
          <div className="kpi-value text-2xl font-semibold tracking-tight">
            #{comparison.rank}
            <span className="text-sm font-medium text-[var(--muted)] ml-1">
              / {comparison.total}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-3">
        <Row
          label="This factory"
          value={fmtPct(comparison.factory_efficiency_pct)}
          width={factoryWidth}
          color="var(--accent)"
        />
        <Row
          label="Network average"
          value={fmtPct(comparison.network_avg_efficiency_pct)}
          width={avgWidth}
          color="var(--info)"
        />
        <Row
          label="Network top"
          value={fmtPct(comparison.network_top_efficiency_pct)}
          width={100}
          color="var(--good)"
        />
      </div>
      <div className="mt-4 pt-4 border-t border-[var(--border)] grid grid-cols-2 gap-4 text-xs">
        <div>
          <div className="text-[var(--muted)]">Good hrs / worker (this)</div>
          <div className="kpi-value text-lg font-semibold mt-0.5">
            {fmtHours(comparison.factory_good_hours_per_worker)}
          </div>
        </div>
        <div>
          <div className="text-[var(--muted)]">Good hrs / worker (avg)</div>
          <div className="kpi-value text-lg font-semibold mt-0.5">
            {fmtHours(comparison.network_avg_good_hours_per_worker)}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  width,
  color,
}: {
  label: string;
  value: string;
  width: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-[var(--foreground)]">{label}</span>
        <span className="tabular text-[var(--muted)]">{value}</span>
      </div>
      <div className="mt-1 h-1.5 rounded-full bg-[var(--surface-muted)] overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${Math.max(2, Math.min(100, width))}%`, background: color }}
        />
      </div>
    </div>
  );
}
