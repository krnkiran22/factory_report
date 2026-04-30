import type { FactoryDayReport, KpiBundle } from "@/lib/types";
import { fmtHours, fmtInt, fmtPct } from "@/lib/format";
import { DeltaChip } from "@/components/ui/DeltaChip";
import { Sparkline } from "@/components/ui/Sparkline";

const TARGET_HOURS_PER_WORKER = 7;

type Props = { report: FactoryDayReport; kpis: KpiBundle };

type Tile = {
  label: string;
  value: string;
  sub?: string;
  delta_pct: number;
  inverted?: boolean;
  spark: { date: string; value: number }[];
  sparkColor: string;
  icon: string;
};

export function KpiGrid({ report, kpis }: Props) {
  /** Owner-centric KPIs only. Each tile maps to a real backend field
   * (good_hours_per_participant, good_hours, bad_hours, participant_count,
   * quality_pct) — no internal infrastructure metrics like SD cards or
   * coverage which a factory owner doesn't need. */
  const targetAttainmentPct =
    (report.good_hours_per_participant / TARGET_HOURS_PER_WORKER) * 100;
  const targetSpark = kpis.efficiency.spark.map((p) => ({
    date: p.date,
    value: (p.value / 100) * 10 / TARGET_HOURS_PER_WORKER * 100,
  }));

  const tiles: Tile[] = [
    {
      label: "Efficiency",
      value: fmtPct(kpis.efficiency.current),
      sub: `${fmtHours(report.good_hours_per_participant)} / worker · 10h shift`,
      delta_pct: kpis.efficiency.delta_pct,
      spark: kpis.efficiency.spark,
      sparkColor: "var(--good)",
      icon: "◎",
    },
    {
      label: "Productive hours",
      value: fmtHours(kpis.good_hours.current),
      sub: "Across all workers today",
      delta_pct: kpis.good_hours.delta_pct,
      spark: kpis.good_hours.spark,
      sparkColor: "var(--good)",
      icon: "▲",
    },
    {
      label: "Idle time",
      value: fmtHours(kpis.bad_hours.current),
      sub: `Out of ${fmtHours(report.recorded_hours)} recorded`,
      delta_pct: kpis.bad_hours.delta_pct,
      inverted: true,
      spark: kpis.bad_hours.spark,
      sparkColor: "var(--bad)",
      icon: "▼",
    },
    {
      label: "Workers active",
      value: fmtInt(kpis.workers.current),
      sub: "Logged in for shift today",
      delta_pct: kpis.workers.delta_pct,
      spark: kpis.workers.spark,
      sparkColor: "var(--info)",
      icon: "◉",
    },
    {
      label: "Hours / worker",
      value: fmtHours(report.good_hours_per_participant),
      sub: "Average productive time per person",
      delta_pct: kpis.efficiency.delta_pct,
      spark: kpis.efficiency.spark.map((p) => ({
        date: p.date,
        value: (p.value / 100) * 10,
      })),
      sparkColor: "var(--violet)",
      icon: "◐",
    },
    {
      label: "Target attainment",
      value: fmtPct(targetAttainmentPct),
      sub: `Goal: ${fmtHours(TARGET_HOURS_PER_WORKER)} / worker`,
      delta_pct: kpis.efficiency.delta_pct,
      spark: targetSpark,
      sparkColor: "var(--amber)",
      icon: "◧",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
      {tiles.map((t, i) => (
        <div
          key={i}
          className="card p-3 sm:p-4 hover:shadow-md transition-shadow flex flex-col min-w-0"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[var(--muted)] min-w-0">
              <span
                className="text-sm leading-none shrink-0"
                style={{ color: t.sparkColor }}
              >
                {t.icon}
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold truncate">
                {t.label}
              </span>
            </div>
            <DeltaChip delta={t.delta_pct} inverted={t.inverted} />
          </div>
          <div className="kpi-value mt-1.5 sm:mt-2 text-xl sm:text-2xl font-semibold tracking-tight truncate">
            {t.value}
          </div>
          {t.sub && (
            <div className="text-[11px] text-[var(--muted)] mt-1 leading-snug line-clamp-2">
              {t.sub}
            </div>
          )}
          <div className="mt-2 -mx-1">
            <Sparkline points={t.spark} color={t.sparkColor} height={28} />
          </div>
        </div>
      ))}
    </div>
  );
}
