import type { Worker } from "@/lib/types";
import { fmtInt, fmtPct } from "@/lib/format";

type Props = {
  workers: Worker[];
  participantCount: number;
};

export function WorkforceSummaryCard({ workers, participantCount }: Props) {
  /** Owner-centric workforce snapshot derived purely from per-worker data:
   * top performer, average productivity, distribution across performance
   * bands, and the count needing immediate attention (<30% productivity). */
  const total = Math.max(1, workers.length);
  const avg = workers.reduce((s, w) => s + w.productivity_pct, 0) / total;
  const top = workers[0];
  const bottom = workers[workers.length - 1];
  const excellent = workers.filter((w) => w.productivity_pct >= 70).length;
  const mid = workers.filter(
    (w) => w.productivity_pct >= 40 && w.productivity_pct < 70,
  ).length;
  const needsHelp = workers.filter((w) => w.productivity_pct < 40).length;

  const distroTotal = excellent + mid + needsHelp || 1;

  return (
    <div className="card p-4 sm:p-5 h-full flex flex-col">
      <div className="text-sm font-semibold tracking-tight">
        Workforce summary
      </div>
      <div className="text-xs text-[var(--muted)] mt-0.5">
        {fmtInt(participantCount)} workers on shift today
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Stat
          label="Avg productivity"
          value={fmtPct(avg)}
          accent="var(--accent)"
        />
        <Stat
          label="Need attention"
          value={fmtInt(needsHelp)}
          sub="below 40% today"
          accent="var(--bad)"
        />
      </div>

      <div className="mt-4 pt-3 border-t border-[var(--border)] space-y-2">
        <Performer
          tag="Top performer"
          name={top.display_name}
          value={fmtPct(top.productivity_pct)}
          color="var(--good)"
        />
        <Performer
          tag="Lowest output"
          name={bottom.display_name}
          value={fmtPct(bottom.productivity_pct)}
          color="var(--bad)"
        />
      </div>

      <div className="mt-4 pt-3 border-t border-[var(--border)]">
        <div className="text-[10px] uppercase tracking-wider text-[var(--muted)] font-semibold mb-2">
          Performance bands
        </div>
        <div className="flex h-2.5 rounded-full overflow-hidden border border-[var(--border)] bg-[var(--surface-muted)]">
          <div
            style={{
              width: `${(excellent / distroTotal) * 100}%`,
              background: "var(--good)",
            }}
            title={`${excellent} excellent`}
          />
          <div
            style={{
              width: `${(mid / distroTotal) * 100}%`,
              background: "var(--warn)",
            }}
            title={`${mid} mid`}
          />
          <div
            style={{
              width: `${(needsHelp / distroTotal) * 100}%`,
              background: "var(--bad)",
            }}
            title={`${needsHelp} needs help`}
          />
        </div>
        <div className="mt-1.5 grid grid-cols-3 gap-2 text-[11px]">
          <Band dot="var(--good)" label="≥70%" count={excellent} />
          <Band dot="var(--warn)" label="40–70%" count={mid} />
          <Band dot="var(--bad)" label="<40%" count={needsHelp} />
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent: string;
}) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2.5">
      <div className="text-[10px] uppercase tracking-wider text-[var(--muted)] flex items-center gap-1.5">
        <span className="dot" style={{ background: accent }} />
        {label}
      </div>
      <div className="kpi-value text-base sm:text-lg font-semibold mt-0.5 tabular">
        {value}
      </div>
      {sub && <div className="text-[10px] text-[var(--muted)]">{sub}</div>}
    </div>
  );
}

function Performer({
  tag,
  name,
  value,
  color,
}: {
  tag: string;
  name: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-[var(--muted)] flex items-center gap-1.5">
          <span className="dot" style={{ background: color }} />
          {tag}
        </div>
        <div className="font-medium truncate">{name}</div>
      </div>
      <div className="kpi-value font-semibold tabular text-sm shrink-0">
        {value}
      </div>
    </div>
  );
}

function Band({
  dot,
  label,
  count,
}: {
  dot: string;
  label: string;
  count: number;
}) {
  return (
    <div className="flex items-center justify-between gap-1 min-w-0">
      <span className="flex items-center gap-1.5 truncate text-[var(--muted)]">
        <span className="dot shrink-0" style={{ background: dot }} />
        {label}
      </span>
      <span className="tabular font-semibold">{count}</span>
    </div>
  );
}
