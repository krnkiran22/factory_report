import { format, parseISO } from "date-fns";
import type { Factory, FactoryDayReport } from "@/lib/types";
import { fmtHours, fmtInt, fmtPct, efficiencyTier } from "@/lib/format";

const TARGET_HOURS_PER_WORKER = 7;

type Props = {
  factory: Factory;
  report: FactoryDayReport;
};

export function PrintHeader({ factory, report }: Props) {
  /** Hidden on screen, shown only when printing. Establishes the document
   * cover with the factory identity and the headline owner-facing totals. */
  const tier = efficiencyTier(report.quality_pct);
  const generatedAt = format(new Date(), "dd MMM yyyy · HH:mm");
  const attainment =
    (report.good_hours_per_participant / TARGET_HOURS_PER_WORKER) * 100;

  return (
    <div className="print-only mb-6">
      <div className="flex items-start justify-between border-b-2 border-black/80 pb-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-black/60 font-semibold">
            Build AI · Operations
          </div>
          <div className="text-[22px] font-semibold tracking-tight mt-1">
            Factory Efficiency Report
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-[0.2em] text-black/60 font-semibold">
            Generated
          </div>
          <div className="text-sm font-medium mt-1">{generatedAt}</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-[1.2fr_1fr] gap-6">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-black/60 font-semibold">
            Site
          </div>
          <div className="text-lg font-semibold mt-0.5">
            {factory.recording_name}
          </div>
          <div className="text-sm text-black/70 mt-0.5">
            {factory.partner_org} · {factory.team} · {factory.industry}
          </div>
          <div className="text-sm text-black/70 mt-2">
            Report date:{" "}
            <span className="font-medium text-black">
              {format(parseISO(report.deployment_date), "EEEE, dd MMMM yyyy")}
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-black/10 bg-black/[0.02] p-3">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <Item
              label="Efficiency"
              value={fmtPct(report.quality_pct)}
              note={tier.label}
            />
            <Item
              label="Target attainment"
              value={fmtPct(attainment)}
              note={`goal ${fmtHours(TARGET_HOURS_PER_WORKER)} / worker`}
            />
            <Item label="Productive hours" value={fmtHours(report.good_hours)} />
            <Item label="Idle hours" value={fmtHours(report.bad_hours)} />
            <Item
              label="Workers active"
              value={fmtInt(report.participant_count)}
            />
            <Item
              label="Hours / worker"
              value={fmtHours(report.good_hours_per_participant)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Item({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div>
      <div className="text-[9px] uppercase tracking-[0.16em] text-black/55 font-semibold">
        {label}
      </div>
      <div className="text-base font-semibold tabular leading-tight">{value}</div>
      {note && <div className="text-[10px] text-black/60">{note}</div>}
    </div>
  );
}
