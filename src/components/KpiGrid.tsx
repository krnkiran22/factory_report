import type { FactoryDayReport } from "@/lib/types";
import { efficiencyTier, fmtHours, fmtInt, fmtPct } from "@/lib/format";

type Props = { report: FactoryDayReport };

export function KpiGrid({ report }: Props) {
  /** Headline tiles in the order a factory operator scans first:
   * efficiency, good vs bad hours, then capacity (workers, devices, cards). */
  const tier = efficiencyTier(report.quality_pct);
  const tiles: Array<{
    label: string;
    value: string;
    sub?: string;
    tone?: "good" | "bad" | "neutral";
    pill?: string;
  }> = [
    {
      label: "Efficiency",
      value: fmtPct(report.quality_pct),
      sub: `${fmtHours(report.good_hours_per_participant)} per worker · 10h shift`,
      tone: "good",
      pill: tier.label,
    },
    {
      label: "Good hours",
      value: fmtHours(report.good_hours),
      sub: `${fmtInt(report.usable_clip_count)} usable clips`,
      tone: "good",
    },
    {
      label: "Idle / bad hours",
      value: fmtHours(report.bad_hours),
      sub: `Recorded ${fmtHours(report.recorded_hours)} total`,
      tone: "bad",
    },
    {
      label: "Workers on shift",
      value: fmtInt(report.participant_count),
      sub: `${fmtInt(report.device_count)} devices active`,
      tone: "neutral",
    },
    {
      label: "SD cards",
      value: fmtInt(report.total_sd_card_count),
      sub: `${fmtInt(report.card_inventory.good_card_count)} good · ${fmtInt(report.card_inventory.bad_card_count)} bad · ${fmtInt(report.card_inventory.empty_card_count)} empty`,
      tone: "neutral",
    },
    {
      label: "Coverage",
      value: fmtPct(report.coverage_pct),
      sub: `${fmtInt(report.evaluated_count)} of ${fmtInt(report.clip_count)} clips evaluated`,
      tone: "neutral",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
      {tiles.map((t, i) => (
        <div key={i} className="card p-4">
          <div className="flex items-center justify-between">
            <div className="text-[11px] uppercase tracking-wide text-[var(--muted)]">
              {t.label}
            </div>
            {t.pill && (
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: tier.bg, color: tier.color }}
              >
                {t.pill}
              </span>
            )}
          </div>
          <div className="kpi-value mt-1.5 text-2xl font-semibold tracking-tight">
            {t.value}
          </div>
          {t.sub && (
            <div className="text-xs text-[var(--muted)] mt-1 leading-snug">
              {t.sub}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
