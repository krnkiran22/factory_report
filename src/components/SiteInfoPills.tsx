import type { Factory } from "@/lib/types";

type Props = { factory: Factory; deploymentDate: string };

export function SiteInfoPills({ factory }: Props) {
  /** Inline pill row showing static factory metadata (industry, partner, team, shift). */
  const items: Array<{ label: string; value: string; color: string }> = [
    { label: "Partner", value: factory.partner_org, color: "var(--violet-soft)" },
    { label: "Team", value: factory.team, color: "var(--info-soft)" },
    { label: "Industry", value: factory.industry, color: "var(--good-soft)" },
    { label: "Shift", value: `${factory.shift_hours}h · 08:00–18:00`, color: "var(--surface-muted)" },
  ];
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((p) => (
        <span
          key={p.label}
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium border border-[var(--border)]"
          style={{ background: p.color }}
        >
          <span className="text-[var(--muted)] uppercase tracking-wider text-[9px]">
            {p.label}
          </span>
          <span className="text-[var(--foreground)]">{p.value}</span>
        </span>
      ))}
    </div>
  );
}
