export function Header() {
  /** Top app bar; static branding with no nav since this is a single-screen report. */
  return (
    <header className="border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-[var(--accent)] grid place-items-center text-white font-semibold tracking-tight">
            B
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight">
              Build AI · Factory Efficiency
            </div>
            <div className="text-xs text-[var(--muted)]">
              Daily good-hours, idle time, and worker productivity per site
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-[var(--muted)]">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          Demo · dummy data
        </div>
      </div>
    </header>
  );
}
