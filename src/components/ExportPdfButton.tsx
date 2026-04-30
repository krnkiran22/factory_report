"use client";

import { useState } from "react";

type Props = {
  factoryName: string;
  date: string;
};

const PAGE_W_MM = 210;
const PAGE_H_MM = 297;
const MARGIN_MM = 10;
const CONTENT_W_MM = PAGE_W_MM - 2 * MARGIN_MM;
const CONTENT_H_MM = PAGE_H_MM - 2 * MARGIN_MM;
const SECTION_GAP_MM = 4;

export function ExportPdfButton({ factoryName, date }: Props) {
  /** Captures each #print-root section to a canvas via html2canvas-pro and packs
   * the images onto A4 pages with jsPDF. Sections that won't fit on the
   * remaining page get bumped to the next, so charts don't split across pages.
   * The body gets `is-exporting` while we capture so PrintHeader is visible
   * and screen-only chrome (header, controls, footer) is hidden. */
  const [busy, setBusy] = useState(false);

  async function exportPdf() {
    setBusy(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas-pro"),
        import("jspdf"),
      ]);

      const root = document.getElementById("print-root");
      if (!root) return;

      document.body.classList.add("is-exporting");
      window.scrollTo({ top: 0, behavior: "instant" });
      await new Promise((r) => requestAnimationFrame(r));
      await new Promise((r) => setTimeout(r, 250));

      const sections = Array.from(
        root.querySelectorAll<HTMLElement>("[data-pdf-section]"),
      );

      const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
      let cursorMm = MARGIN_MM;
      let firstPage = true;
      let placedAnything = false;

      for (let i = 0; i < sections.length; i++) {
        const el = sections[i];
        const rect = el.getBoundingClientRect();
        if (rect.width <= 1 || rect.height <= 1) continue;

        const canvas = await html2canvas(el, {
          scale: 2,
          backgroundColor: "#ffffff",
          useCORS: true,
          logging: false,
          windowWidth: Math.max(1280, document.documentElement.scrollWidth),
        });
        if (!canvas || !canvas.width || !canvas.height) continue;

        const wMm = CONTENT_W_MM;
        const hMm = (canvas.height * wMm) / canvas.width;
        if (!Number.isFinite(hMm) || hMm <= 0) continue;

        if (hMm > CONTENT_H_MM) {
          if (placedAnything) pdf.addPage();
          firstPage = false;
          placedAnything = true;
          const slices = Math.ceil(hMm / CONTENT_H_MM);
          const sliceHeightPx = Math.floor(canvas.height / slices);
          for (let s = 0; s < slices; s++) {
            if (s > 0) pdf.addPage();
            const sliceCanvas = document.createElement("canvas");
            sliceCanvas.width = canvas.width;
            sliceCanvas.height = sliceHeightPx;
            const ctx = sliceCanvas.getContext("2d");
            if (!ctx) continue;
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
            ctx.drawImage(
              canvas,
              0,
              s * sliceHeightPx,
              canvas.width,
              sliceHeightPx,
              0,
              0,
              canvas.width,
              sliceHeightPx,
            );
            const sliceData = sliceCanvas.toDataURL("image/jpeg", 0.92);
            pdf.addImage(
              sliceData,
              "JPEG",
              MARGIN_MM,
              MARGIN_MM,
              wMm,
              CONTENT_H_MM,
              undefined,
              "FAST",
            );
          }
          cursorMm = MARGIN_MM + CONTENT_H_MM;
          continue;
        }

        const fitsOnPage = cursorMm + hMm <= MARGIN_MM + CONTENT_H_MM;
        if (!fitsOnPage) {
          if (placedAnything) pdf.addPage();
          firstPage = false;
          cursorMm = MARGIN_MM;
        } else if (firstPage) {
          firstPage = false;
        }

        const imgData = canvas.toDataURL("image/jpeg", 0.92);
        pdf.addImage(
          imgData,
          "JPEG",
          MARGIN_MM,
          cursorMm,
          wMm,
          hMm,
          undefined,
          "FAST",
        );
        cursorMm += hMm + SECTION_GAP_MM;
        placedAnything = true;
      }

      if (!placedAnything) {
        throw new Error("Nothing to capture — check that #print-root has visible content.");
      }

      const pageCount = pdf.getNumberOfPages();
      for (let p = 1; p <= pageCount; p++) {
        pdf.setPage(p);
        pdf.setFontSize(8);
        pdf.setTextColor(120);
        pdf.text(
          `${factoryName} · ${date}`,
          MARGIN_MM,
          PAGE_H_MM - 4,
        );
        pdf.text(
          `Page ${p} of ${pageCount}`,
          PAGE_W_MM - MARGIN_MM,
          PAGE_H_MM - 4,
          { align: "right" },
        );
      }

      const slug = factoryName.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
      pdf.save(`factory-efficiency-${slug}-${date}.pdf`);
    } catch (err) {
      console.error("PDF export failed", err);
      alert("PDF export failed — check console for details.");
    } finally {
      document.body.classList.remove("is-exporting");
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={exportPdf}
      disabled={busy}
      aria-label="Export PDF"
      className="no-print inline-flex items-center gap-1.5 sm:gap-2 rounded-full px-3 py-2 sm:px-3.5 sm:py-1.5 text-[11px] sm:text-xs font-semibold border border-[var(--border)] bg-[var(--foreground)] text-white hover:opacity-90 active:opacity-80 transition disabled:opacity-60"
      style={{ fontSize: "13px" }}
    >
      {busy ? (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" className="animate-spin" aria-hidden>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" fill="none" opacity="0.25" />
            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </svg>
          <span className="hidden sm:inline">Generating…</span>
          <span className="sm:hidden">…</span>
        </>
      ) : (
        <>
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
          <span className="hidden sm:inline">Export PDF</span>
          <span className="sm:hidden">PDF</span>
        </>
      )}
    </button>
  );
}
