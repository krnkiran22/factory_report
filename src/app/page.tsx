import { Suspense } from "react";
import { Controls } from "@/components/Controls";
import { DailyTrendChart } from "@/components/DailyTrendChart";
import { EfficiencyHeatmap } from "@/components/EfficiencyHeatmap";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { HourlyEfficiencyChart } from "@/components/HourlyEfficiencyChart";
import { KpiGrid } from "@/components/KpiGrid";
import { PrintHeader } from "@/components/PrintHeader";
import { TargetAttainmentCard } from "@/components/TargetAttainmentCard";
import { TimeDistributionDonut } from "@/components/TimeDistributionDonut";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { WorkerHistogram } from "@/components/WorkerHistogram";
import { WorkersTable } from "@/components/WorkersTable";
import { WorkforceSummaryCard } from "@/components/WorkforceSummaryCard";
import { FACTORIES, getFactory } from "@/lib/factories";
import {
  getDailyTrend,
  getEfficiencyHeatmap,
  getFactoryDayReport,
  getKpiBundle,
  getWorkerHistogram,
} from "@/lib/dummy-data";
import { format, parseISO, subDays } from "date-fns";

const DEFAULT_DATE = "2026-04-29";
const DEFAULT_SITE = FACTORIES[0].site_id;

type SearchParams = Promise<{ site?: string; date?: string }>;

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  /** Server component — resolves URL params, generates deterministic dummy
   * data and composes the full one-page operational dashboard. */
  const sp = await searchParams;
  const siteId =
    sp.site && FACTORIES.some((f) => f.site_id === sp.site)
      ? sp.site
      : DEFAULT_SITE;
  const date =
    sp.date && /^\d{4}-\d{2}-\d{2}$/.test(sp.date) ? sp.date : DEFAULT_DATE;

  const factory = getFactory(siteId)!;
  const report = getFactoryDayReport(siteId, date);
  const kpis = getKpiBundle(siteId, date, 7);
  const trend = getDailyTrend(siteId, date, 7);
  const heatmap = getEfficiencyHeatmap(siteId, date, 35);
  const histogram = report ? getWorkerHistogram(report.workers) : [];
  const yesterdayDate = format(subDays(parseISO(date), 1), "yyyy-MM-dd");
  const yesterdayReport = getFactoryDayReport(siteId, yesterdayDate);
  const yesterdayPerWorker = yesterdayReport?.good_hours_per_participant ?? 0;

  return (
    <>
      <Header date={date} factoryName={factory.recording_name} />
      <main
        className="mx-auto max-w-[1440px] w-full px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 flex-1"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 1rem)" }}
      >
        <Suspense>
          <Controls siteId={siteId} date={date} />
        </Suspense>

        {report ? (
          <div id="print-root" className="space-y-4 sm:space-y-6">
            <div data-pdf-section>
              <PrintHeader factory={factory} report={report} />
            </div>

            <section id="overview" data-pdf-section>
              <HeroSection factory={factory} report={report} kpis={kpis} />
            </section>

            <section data-pdf-section>
              <SectionTitle
                eyebrow="Snapshot"
                title="Today's metrics"
                description="The numbers a factory owner needs to glance at — productivity, hours per worker, and progress against today's goal."
              />
              <KpiGrid report={report} kpis={kpis} />
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              <div data-pdf-section>
                <WorkforceSummaryCard
                  workers={report.workers}
                  participantCount={report.participant_count}
                />
              </div>
              <div data-pdf-section>
                <TargetAttainmentCard
                  goodHoursPerWorker={report.good_hours_per_participant}
                  yesterdayPerWorker={yesterdayPerWorker}
                />
              </div>
              <div data-pdf-section>
                <TimeDistributionDonut hours={report.hourly_activity} />
              </div>
            </section>

            <section id="hourly" className="space-y-3">
              <div data-pdf-section>
                <SectionTitle
                  eyebrow="Hourly"
                  title="Hour-by-hour shift breakdown"
                  description="See exactly which hours of the day your workforce is most and least productive."
                />
              </div>
              <div data-pdf-section>
                <HourlyEfficiencyChart hours={report.hourly_activity} goodHours={report.good_hours} />
              </div>
            </section>

            <section id="trends" className="space-y-3">
              <div data-pdf-section>
                <SectionTitle
                  eyebrow="History"
                  title="Recent trends"
                  description="How the past week and past month have been trending — to spot good days, bad days, and weekly patterns."
                />
              </div>
              <div data-pdf-section>
                <DailyTrendChart trend={trend} />
              </div>
              <div data-pdf-section>
                <EfficiencyHeatmap cells={heatmap} />
              </div>
            </section>

            <section id="workers" className="space-y-3">
              <div data-pdf-section>
                <SectionTitle
                  eyebrow="People"
                  title="Worker performance"
                  description="See who is leading the floor and who needs a hand."
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <div data-pdf-section>
                  <WorkerHistogram buckets={histogram} />
                </div>
                <div className="lg:col-span-2" data-pdf-section>
                  <WorkersTable workers={report.workers} />
                </div>
              </div>
            </section>
          </div>
        ) : (
          <div className="card p-8 text-center text-[var(--muted)]">
            No data for the selected factory and date.
          </div>
        )}

        <footer className="pt-2 pb-8 text-xs text-[var(--muted)] text-center no-print">
          Factory daily efficiency report · for site management and ownership
        </footer>
      </main>
    </>
  );
}
