import { format, parseISO } from "date-fns";
import { Suspense } from "react";
import { CardInventoryPanel } from "@/components/CardInventoryPanel";
import { Controls } from "@/components/Controls";
import { DailyTrendChart } from "@/components/DailyTrendChart";
import { Header } from "@/components/Header";
import { HourlyClipsChart } from "@/components/HourlyClipsChart";
import { HourlyEfficiencyChart } from "@/components/HourlyEfficiencyChart";
import { KpiGrid } from "@/components/KpiGrid";
import { WorkersTable } from "@/components/WorkersTable";
import { FACTORIES } from "@/lib/factories";
import { getDailyTrend, getFactoryDayReport } from "@/lib/dummy-data";
import { fmtHours } from "@/lib/format";

const DEFAULT_DATE = "2026-04-29";
const DEFAULT_SITE = FACTORIES[0].site_id;

type SearchParams = Promise<{ site?: string; date?: string }>;

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  /** Server component: resolves the URL params, generates a deterministic
   * dummy report, and renders the full single-page dashboard. */
  const sp = await searchParams;
  const siteId =
    sp.site && FACTORIES.some((f) => f.site_id === sp.site)
      ? sp.site
      : DEFAULT_SITE;
  const date = sp.date && /^\d{4}-\d{2}-\d{2}$/.test(sp.date) ? sp.date : DEFAULT_DATE;
  const report = getFactoryDayReport(siteId, date);
  const trend = getDailyTrend(siteId, date, 7);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl w-full px-4 sm:px-6 py-6 space-y-6 flex-1">
        <Suspense>
          <Controls siteId={siteId} date={date} />
        </Suspense>

        {report ? (
          <>
            <section className="space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
                    {report.recording_name}
                  </h1>
                  <div className="text-sm text-[var(--muted)] mt-0.5">
                    Report for {format(parseISO(report.deployment_date), "EEEE, dd MMM yyyy")} ·
                    {" "}
                    {fmtHours(report.recorded_hours)} recorded across{" "}
                    {report.device_count} devices
                  </div>
                </div>
              </div>
              <KpiGrid report={report} />
            </section>

            <section>
              <HourlyEfficiencyChart hours={report.hourly_activity} />
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              <div className="lg:col-span-2">
                <HourlyClipsChart hours={report.hourly_activity} />
              </div>
              <CardInventoryPanel
                inventory={report.card_inventory}
                deviceCount={report.device_count}
              />
            </section>

            <section>
              <DailyTrendChart trend={trend} />
            </section>

            <section>
              <WorkersTable workers={report.workers} />
            </section>
          </>
        ) : (
          <div className="card p-8 text-center text-[var(--muted)]">
            No data for the selected factory and date.
          </div>
        )}

        <footer className="pt-2 pb-6 text-xs text-[var(--muted)] text-center">
          Standalone demo · metric names mirror{" "}
          <code className="font-mono">core/dal/product/report_v1</code>
        </footer>
      </main>
    </>
  );
}
