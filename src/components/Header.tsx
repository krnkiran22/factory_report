import { format } from "date-fns";
import { ExportPdfButton } from "./ExportPdfButton";

type Props = { date: string; factoryName: string };

export function Header({ date, factoryName }: Props) {
  /** Top app bar: branded logo, breadcrumbs, status pill, and PDF export CTA.
   * Mobile: hides nav, subtitle, avatar; keeps logo + title + export button. */
  return (
    <header
      className="sticky top-0 z-20 backdrop-blur-md bg-white/80 border-b border-[var(--border)] no-print"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="mx-auto max-w-[1440px] px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl grid place-items-center text-white font-bold text-[12px] sm:text-sm tracking-tight shrink-0"
            style={{
              background:
                "linear-gradient(135deg, #0d0d0c 0%, #2a2a28 100%)",
            }}
          >
            BA
          </div>
          <div className="min-w-0">
            <div className="hidden sm:block text-[10px] uppercase tracking-widest text-[var(--muted)] font-semibold">
              Build AI · Operations
            </div>
            <div className="text-[13px] sm:text-sm font-semibold tracking-tight truncate">
              Factory Efficiency
            </div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1 bg-[var(--surface-muted)] rounded-full p-1 border border-[var(--border)]">
          {["Overview", "Hourly", "Trends", "Workers"].map((t, i) => (
            <a
              key={t}
              href={`#${t.toLowerCase()}`}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition ${
                i === 0
                  ? "bg-white shadow-sm text-[var(--foreground)]"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {t}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden lg:flex items-center gap-2 text-xs text-[var(--muted)] bg-[var(--surface-muted)] border border-[var(--border)] rounded-full px-3 py-1.5">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-soft" />
            {format(new Date(date), "dd MMM")}
          </div>
          <ExportPdfButton factoryName={factoryName} date={date} />
          <div className="hidden md:grid h-9 w-9 rounded-full bg-[var(--surface-muted)] border border-[var(--border)] place-items-center text-xs font-semibold">
            KK
          </div>
        </div>
      </div>
    </header>
  );
}
