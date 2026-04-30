"use client";

import { useState } from "react";

type Props = {
  factoryName: string;
  date: string;
};

export function ExportPdfButton({ factoryName, date }: Props) {
  /** Triggers browser print-to-PDF with a friendly title. The actual styling
   * for the printed report lives in @media print rules in globals.css. */
  const [busy, setBusy] = useState(false);

  function handleExport() {
    setBusy(true);
    const slug = factoryName.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
    const previousTitle = document.title;
    document.title = `factory-efficiency-${slug}-${date}`;
    requestAnimationFrame(() => {
      window.print();
      document.title = previousTitle;
      setBusy(false);
    });
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={busy}
      className="no-print inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold border border-[var(--border)] bg-[var(--foreground)] text-white hover:opacity-90 active:opacity-80 transition disabled:opacity-60"
    >
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      {busy ? "Preparing…" : "Export PDF"}
    </button>
  );
}
