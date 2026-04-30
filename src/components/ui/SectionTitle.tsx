import type { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  right?: ReactNode;
};

export function SectionTitle({ eyebrow, title, description, right }: Props) {
  /** Reusable section header with eyebrow tag, title, optional description, and right slot. */
  return (
    <div className="flex items-end justify-between gap-3 mb-2 sm:mb-3">
      <div className="min-w-0">
        {eyebrow && (
          <div className="section-title mb-1 sm:mb-1.5">{eyebrow}</div>
        )}
        <h2 className="text-[15px] sm:text-base lg:text-lg font-semibold tracking-tight text-[var(--foreground)]">
          {title}
        </h2>
        {description && (
          <p className="text-[11px] sm:text-xs text-[var(--muted)] mt-0.5 max-w-xl">
            {description}
          </p>
        )}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}
