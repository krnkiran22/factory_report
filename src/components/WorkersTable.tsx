import type { Worker } from "@/lib/types";
import { fmtHours, fmtInt, fmtPct } from "@/lib/format";

type Props = { workers: Worker[] };

export function WorkersTable({ workers }: Props) {
  /** Top-N workers sorted by productivity_pct, with a slim quality bar.
   * Mirrors the per-worker payload from `_helpers.productivity_pct_from_usable_clips`. */
  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold tracking-tight">
            Worker leaderboard
          </div>
          <div className="text-xs text-[var(--muted)] mt-0.5">
            Productivity = good hours / 10h shift · usable clips × 0.05h each
          </div>
        </div>
        <span className="text-xs text-[var(--muted)]">
          Showing {workers.length}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[var(--surface-muted)] text-[11px] uppercase tracking-wide text-[var(--muted)]">
            <tr>
              <th className="text-left font-medium px-5 py-2.5">#</th>
              <th className="text-left font-medium px-3 py-2.5">Worker</th>
              <th className="text-left font-medium px-3 py-2.5">Device</th>
              <th className="text-right font-medium px-3 py-2.5">Usable / Total clips</th>
              <th className="text-right font-medium px-3 py-2.5">Good hours</th>
              <th className="text-right font-medium px-3 py-2.5">Quality</th>
              <th className="text-left font-medium px-5 py-2.5 w-[28%]">Productivity</th>
            </tr>
          </thead>
          <tbody>
            {workers.map((w, i) => (
              <tr
                key={w.worker_id}
                className="border-t border-[var(--border)] hover:bg-[var(--surface-muted)]/50"
              >
                <td className="px-5 py-2.5 text-[var(--muted)] tabular-nums">{i + 1}</td>
                <td className="px-3 py-2.5 font-medium">{w.display_name}</td>
                <td className="px-3 py-2.5 text-[var(--muted)] font-mono text-xs">
                  {w.device_id}
                </td>
                <td className="px-3 py-2.5 text-right tabular-nums">
                  {fmtInt(w.usable_clip_count)} / {fmtInt(w.total_clip_count)}
                </td>
                <td className="px-3 py-2.5 text-right tabular-nums">
                  {fmtHours(w.good_hours)}
                </td>
                <td className="px-3 py-2.5 text-right tabular-nums">
                  {fmtPct(w.avg_quality_pct)}
                </td>
                <td className="px-5 py-2.5">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 rounded-full bg-[var(--surface-muted)] overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(100, w.productivity_pct)}%`,
                          background:
                            w.productivity_pct >= 70
                              ? "var(--good)"
                              : w.productivity_pct >= 40
                                ? "var(--warn)"
                                : "var(--bad)",
                        }}
                      />
                    </div>
                    <div className="text-xs tabular-nums w-12 text-right">
                      {fmtPct(w.productivity_pct)}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
