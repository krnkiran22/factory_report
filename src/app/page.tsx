import { Suspense } from "react";
import { CardInventoryPanel } from "@/components/CardInventoryPanel";
import { Controls } from "@/components/Controls";
import { DailyTrendChart } from "@/components/DailyTrendChart";
import { EfficiencyHeatmap } from "@/components/EfficiencyHeatmap";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { HourlyClipsChart } from "@/components/HourlyClipsChart";
import { HourlyEfficiencyChart } from "@/components/HourlyEfficiencyChart";
import { KpiGrid } from "@/components/KpiGrid";
import { NetworkComparisonCard } from "@/components/NetworkComparison";
import { ShiftRhythmGauge } from "@/components/ShiftRhythmGauge";
import { TimeDistributionDonut } from "@/components/TimeDistributionDonut";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { WorkerHistogram } from "@/components/WorkerHistogram";
import { WorkersTable } from "@/components/WorkersTable";
import { FACTORIES, getFactory } from "@/lib/factories";
import {
  getDailyTrend,
  getEfficiencyHeatmap,
  getFactoryDayReport,
  getKpiBundle,
  getNetworkComparison,
  getShiftRhythm,
  getWorkerHistogram,
} from "@/lib/dummy-data";

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
  const network = getNetworkComparison(siteId, date);
  const rhythm = getShiftRhythm(new Date());

  return (
    <>
      <Header date={date} />
      <main className="mx-auto max-w-[1440px] w-full px-4 sm:px-6 py-6 space-y-6 flex-1">
        <Suspense>
          <Controls siteId={siteId} date={date} />
        </Suspense>

        {report ? (
          <>
            <section id="overview">
              <HeroSection factory={factory} report={report} kpis={kpis} />
            </section>

            <section>
              <SectionTitle
                eyebrow="Snapshot"
                title="Today's metrics"
                description="Six core KPIs for the selected day with 7-day micro-trends and day-over-day deltas."
              />
              <KpiGrid report={report} kpis={kpis} />
            </section>

            <section id="hourly" className="space-y-3">
              <SectionTitle
                eyebrow="Hourly"
                title="Hour-by-hour shift breakdown"
                description="The 10-hour shift sliced into hourly working / idle / device-off shares with overlaid quality."
              />
              <HourlyEfficiencyChart hours={report.hourly_activity} goodHours={report.good_hours} />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <div className="lg:col-span-2">
                  <HourlyClipsChart hours={report.hourly_activity} />
                </div>
                <TimeDistributionDonut hours={report.hourly_activity} />
              </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              <NetworkComparisonCard comparison={network} />
              <ShiftRhythmGauge rhythm={rhythm} />
              <CardInventoryPanel
                inventory={report.card_inventory}
                deviceCount={report.device_count}
              />
            </section>

            <section id="trends" className="space-y-3">
              <SectionTitle
                eyebrow="History"
                title="Recent trends"
                description="Past week and past month at a glance."
              />
              <DailyTrendChart trend={trend} />
              <EfficiencyHeatmap cells={heatmap} />
            </section>

            <section id="workers" className="space-y-3">
              <SectionTitle
                eyebrow="People"
                title="Worker performance"
                description="Distribution of productivity bands and the leaderboard for the day."
              />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <WorkerHistogram buckets={histogram} />
                <div className="lg:col-span-2">
                  <WorkersTable workers={report.workers} />
                </div>
              </div>
            </section>
          </>
        ) : (
          <div className="card p-8 text-center text-[var(--muted)]">
            No data for the selected factory and date.
          </div>
        )}

        <footer className="pt-2 pb-8 text-xs text-[var(--muted)] text-center">
          Standalone demo · all metrics mirror{" "}
          <code className="font-mono px-1 py-0.5 rounded bg-[var(--surface-muted)]">
            core/dal/product/report_v1
          </code>{" "}
          · swap{" "}
          <code className="font-mono px-1 py-0.5 rounded bg-[var(--surface-muted)]">
            src/lib/dummy-data.ts
          </code>{" "}
          for live API
        </footer>
      </main>
    </>
  );
}
