"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { FACTORIES } from "@/lib/factories";

type Props = {
  siteId: string;
  date: string;
};

export function Controls({ siteId, date }: Props) {
  /** Filter strip: factory combobox + date picker. Updates URL params so the
   * server component re-renders with new selection. */
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const factory = FACTORIES.find((f) => f.site_id === siteId);

  function update(next: Record<string, string>) {
    const sp = new URLSearchParams(params?.toString());
    for (const [k, v] of Object.entries(next)) sp.set(k, v);
    startTransition(() => {
      router.replace(`/?${sp.toString()}`);
    });
  }

  return (
    <div className="card p-3.5 sm:p-4 flex flex-col sm:flex-row gap-3.5 items-stretch sm:items-center no-print">
      <div className="flex-1 min-w-0">
        <label className="block text-[12px] sm:text-[10px] uppercase tracking-wider font-semibold text-[var(--muted)] mb-1.5 sm:mb-1">
          Factory
        </label>
        <div className="relative">
          <select
            value={siteId}
            onChange={(e) => update({ site: e.target.value })}
            className="w-full appearance-none bg-white border border-[var(--border)] hover:border-[var(--border-strong)] rounded-lg pl-3.5 pr-10 py-3 sm:py-2.5 text-base sm:text-sm font-semibold sm:font-medium leading-snug focus:outline-none focus:ring-2 focus:ring-[var(--foreground)]/10"
          >
            {FACTORIES.map((f) => (
              <option key={f.site_id} value={f.site_id}>
                {f.recording_name}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground)]/70 text-base sm:text-xs">
            ▾
          </span>
        </div>
      </div>
      <div className="sm:w-52">
        <label className="block text-[12px] sm:text-[10px] uppercase tracking-wider font-semibold text-[var(--muted)] mb-1.5 sm:mb-1">
          Report date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => update({ date: e.target.value })}
          className="w-full bg-white border border-[var(--border)] hover:border-[var(--border-strong)] rounded-lg px-3.5 py-3 sm:py-2.5 text-base sm:text-sm font-semibold sm:font-medium leading-snug focus:outline-none focus:ring-2 focus:ring-[var(--foreground)]/10"
        />
      </div>
      <div className="flex items-center gap-3 sm:pt-5">
        <span className="text-[13px] sm:text-[11px] text-[var(--muted)] font-medium">
          {pending ? (
            <span className="inline-flex items-center gap-2">
              <span className="inline-flex h-2 w-2 sm:h-1.5 sm:w-1.5 rounded-full bg-amber-500 animate-pulse-soft" />
              Loading…
            </span>
          ) : factory ? (
            <span className="inline-flex items-center gap-2">
              <span className="inline-flex h-2 w-2 sm:h-1.5 sm:w-1.5 rounded-full bg-emerald-500" />
              {factory.worker_count} workers on roster
            </span>
          ) : null}
        </span>
      </div>
    </div>
  );
}
