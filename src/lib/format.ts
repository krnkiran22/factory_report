/**
 * Formatting helpers used across the report UI.
 * All numeric formatting uses tabular numerals; pct values are clamped 0..100.
 */

export function fmtHours(h: number): string {
  return `${h.toFixed(1)}h`;
}

export function fmtPct(p: number): string {
  const clamped = Math.max(0, Math.min(100, p));
  return `${clamped.toFixed(1)}%`;
}

export function fmtInt(n: number): string {
  return n.toLocaleString("en-IN");
}

export function fmtMinutes(m: number): string {
  if (m < 60) return `${Math.round(m)}m`;
  const h = Math.floor(m / 60);
  const rem = Math.round(m - h * 60);
  return rem > 0 ? `${h}h ${rem}m` : `${h}h`;
}

export function efficiencyTier(pct: number): {
  label: string;
  color: string;
  bg: string;
} {
  if (pct >= 70) return { label: "Excellent", color: "#15803d", bg: "#dcfce7" };
  if (pct >= 50) return { label: "Good", color: "#15803d", bg: "#ecfccb" };
  if (pct >= 30) return { label: "Needs review", color: "#b45309", bg: "#fef3c7" };
  return { label: "Poor", color: "#b91c1c", bg: "#fee2e2" };
}
