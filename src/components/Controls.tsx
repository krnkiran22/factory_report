"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { FACTORIES } from "@/lib/factories";

type Props = {
  siteId: string;
  date: string;
};

export function Controls({ siteId, date }: Props) {
  /** Top-of-page controls: factory dropdown + date picker.
   * Updates the URL search params so the server component re-renders
   * with a new factory/date selection. */
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  function update(next: Record<string, string>) {
    const sp = new URLSearchParams(params?.toString());
    for (const [k, v] of Object.entries(next)) sp.set(k, v);
    startTransition(() => {
      router.replace(`/?${sp.toString()}`);
    });
  }

  return (
    <div className="card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-end gap-4">
      <div className="flex-1">
        <label className="text-xs uppercase tracking-wide text-[var(--muted)]">
          Factory
        </label>
        <select
          value={siteId}
          onChange={(e) => update({ site: e.target.value })}
          className="mt-1 w-full bg-[var(--surface-muted)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/10"
        >
          {FACTORIES.map((f) => (
            <option key={f.site_id} value={f.site_id}>
              {f.recording_name} — {f.team}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:w-56">
        <label className="text-xs uppercase tracking-wide text-[var(--muted)]">
          Report date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => update({ date: e.target.value })}
          className="mt-1 w-full bg-[var(--surface-muted)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/10"
        />
      </div>
      <div className="text-xs text-[var(--muted)] sm:pb-2.5">
        {pending ? "Loading…" : "Showing data for selected day"}
      </div>
    </div>
  );
}
