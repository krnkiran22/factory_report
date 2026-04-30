type Props = {
  delta: number;
  inverted?: boolean;
  suffix?: string;
};

export function DeltaChip({ delta, inverted = false, suffix = "%" }: Props) {
  /** Day-over-day change pill. `inverted` flips colors for metrics where down is good. */
  if (!Number.isFinite(delta)) return null;
  const isUp = delta > 0;
  const isFlat = delta === 0;
  const goodDirection = inverted ? !isUp : isUp;
  const tone = isFlat
    ? { fg: "var(--muted)", bg: "var(--surface-muted)" }
    : goodDirection
      ? { fg: "var(--good-ink)", bg: "var(--good-soft)" }
      : { fg: "var(--bad-ink)", bg: "var(--bad-soft)" };
  const arrow = isFlat ? "·" : isUp ? "▲" : "▼";
  const sign = isUp ? "+" : "";
  return (
    <span
      className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold tabular"
      style={{ color: tone.fg, background: tone.bg }}
    >
      <span className="text-[8px] leading-none translate-y-[-0.5px]">{arrow}</span>
      {sign}
      {Math.abs(delta).toFixed(1)}
      {suffix}
    </span>
  );
}
