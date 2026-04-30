import { format, parseISO } from "date-fns";
import type { Factory, FactoryDayReport, KpiBundle } from "@/lib/types";
import { fmtHours, fmtInt, fmtPct } from "@/lib/format";
import { EfficiencyGauge } from "./EfficiencyGauge";
import { SiteInfoPills } from "./SiteInfoPills";
import { DeltaChip } from "./ui/DeltaChip";

type Props = {
  factory: Factory;
  report: FactoryDayReport;
  kpis: KpiBundle;
};

export function HeroSection({ factory, report, kpis }: Props) {
  /** Premium hero card: site name, metadata pills, big efficiency gauge, and
   * three flagship metrics (good hours, workers, clips) with deltas. */
  return (
    <div className="card-hero p-4 sm:p-6 lg:p-7">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-5 lg:gap-6 items-start">
        <div className="min-w-0 order-2 lg:order-1">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[var(--muted)] font-semibold">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="truncate">
              Daily report · {format(parseISO(report.deployment_date), "EEE, dd MMM yyyy")}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-[28px] font-semibold tracking-tight mt-2 leading-tight break-words">
            {factory.recording_name}
          </h1>
          <p className="text-[13px] sm:text-sm text-[var(--muted)] mt-1 leading-relaxed">
            {fmtHours(report.recorded_hours)} recorded across{" "}
            <span className="text-[var(--foreground)] font-medium">{fmtInt(report.device_count)}</span>{" "}
            devices ·{" "}
            <span className="text-[var(--foreground)] font-medium">{fmtInt(report.participant_count)}</span>{" "}
            workers · {fmtInt(report.usable_clip_count)} usable clips
          </p>

          <div className="mt-3 sm:mt-4">
            <SiteInfoPills factory={factory} deploymentDate={report.deployment_date} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 mt-5 sm:mt-6">
            <Flagship
              label="Productive hours"
              value={fmtHours(report.good_hours)}
              delta={kpis.good_hours.delta_pct}
              color="var(--good)"
            />
            <Flagship
              label="Idle time"
              value={fmtHours(report.bad_hours)}
              delta={kpis.bad_hours.delta_pct}
              color="var(--bad)"
              inverted
            />
            <Flagship
              label="Per worker"
              value={`${report.good_hours_per_participant.toFixed(1)}h`}
              delta={kpis.efficiency.delta_pct}
              color="var(--info)"
              sub={`${fmtPct(report.quality_pct)} of 10h shift`}
            />
          </div>
        </div>

        <div className="lg:pl-6 lg:border-l lg:border-[var(--border)] flex flex-col items-center order-1 lg:order-2 w-full lg:w-auto">
          <EfficiencyGauge value={report.quality_pct} />
          <div className="mt-3 inline-flex items-center gap-2 text-xs">
            <span className="text-[var(--muted)]">vs yesterday</span>
            <DeltaChip delta={kpis.efficiency.delta_pct} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Flagship({
  label,
  value,
  delta,
  color,
  sub,
  inverted,
}: {
  label: string;
  value: string;
  delta: number;
  color: string;
  sub?: string;
  inverted?: boolean;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-white/60 px-3.5 py-3">
      <div className="flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-wider text-[var(--muted)] font-semibold flex items-center gap-1.5">
          <span className="dot" style={{ background: color }} />
          {label}
        </div>
        <DeltaChip delta={delta} inverted={inverted} />
      </div>
      <div className="kpi-value text-2xl font-semibold tracking-tight mt-1.5">
        {value}
      </div>
      {sub && (
        <div className="text-[11px] text-[var(--muted)] mt-0.5">{sub}</div>
      )}
    </div>
  );
}
