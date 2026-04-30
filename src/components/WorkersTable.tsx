import type { Worker } from "@/lib/types";
import { fmtHours, fmtInt, fmtPct } from "@/lib/format";

type Props = { workers: Worker[] };

function avatarColor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const palette = [
    "#fee2e2",
    "#fef3c7",
    "#dcfce7",
    "#dbeafe",
    "#ede9fe",
    "#ccfbf1",
    "#fce7f3",
    "#ffedd5",
  ];
  return palette[h % palette.length];
}

export function WorkersTable({ workers }: Props) {
  /** Top-N workers sorted by productivity_pct, with avatar, productivity bar,
   * and quality micro-bar. Mirrors `_helpers.productivity_pct_from_usable_clips`. */
  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between flex-wrap gap-2">
        <div>
          <div className="text-sm font-semibold tracking-tight">
            Worker leaderboard
          </div>
          <div className="text-xs text-[var(--muted)] mt-0.5">
            Productivity = good hours / 10h shift · usable clips × 0.05h each
          </div>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-[var(--muted)]">
          <span className="flex items-center gap-1.5">
            <span className="dot" style={{ background: "var(--good)" }} /> ≥70% excellent
          </span>
          <span className="flex items-center gap-1.5">
            <span className="dot" style={{ background: "var(--warn)" }} /> 40–70% mid
          </span>
          <span className="flex items-center gap-1.5">
            <span className="dot" style={{ background: "var(--bad)" }} /> &lt;40% poor
          </span>
        </div>
      </div>
      <div className="overflow-x-auto scroll-thin">
        <table className="w-full text-sm">
          <thead className="bg-[var(--surface-muted)] text-[10px] uppercase tracking-wider text-[var(--muted)]">
            <tr>
              <th className="text-left font-semibold px-5 py-2.5 w-10">#</th>
              <th className="text-left font-semibold px-3 py-2.5">Worker</th>
              <th className="text-left font-semibold px-3 py-2.5">Device</th>
              <th className="text-right font-semibold px-3 py-2.5">Usable / Total</th>
              <th className="text-right font-semibold px-3 py-2.5">Good hrs</th>
              <th className="text-left font-semibold px-3 py-2.5 w-[18%]">Quality</th>
              <th className="text-left font-semibold px-5 py-2.5 w-[26%]">Productivity</th>
            </tr>
          </thead>
          <tbody>
            {workers.map((w, i) => (
              <tr
                key={w.worker_id}
                className="border-t border-[var(--border)] hover:bg-[var(--surface-muted)]/50 transition-colors"
              >
                <td className="px-5 py-2.5 text-[var(--muted)] tabular text-xs">
                  {String(i + 1).padStart(2, "0")}
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="h-7 w-7 rounded-full grid place-items-center text-[10px] font-semibold text-[var(--foreground)]"
                      style={{ background: avatarColor(w.worker_id) }}
                    >
                      {w.display_name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                    </div>
                    <span className="font-medium">{w.display_name}</span>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-[var(--muted)] font-mono text-xs">
                  {w.device_id}
                </td>
                <td className="px-3 py-2.5 text-right tabular">
                  {fmtInt(w.usable_clip_count)} / {fmtInt(w.total_clip_count)}
                </td>
                <td className="px-3 py-2.5 text-right tabular">
                  {fmtHours(w.good_hours)}
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 rounded-full bg-[var(--surface-muted)] overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(100, w.avg_quality_pct)}%`,
                          background: "var(--info)",
                        }}
                      />
                    </div>
                    <div className="text-[11px] tabular w-10 text-right text-[var(--muted)]">
                      {fmtPct(w.avg_quality_pct)}
                    </div>
                  </div>
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
                    <div className="text-xs tabular w-12 text-right font-semibold">
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
