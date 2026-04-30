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
    <div className="flex items-end justify-between gap-4 mb-3">
      <div>
        {eyebrow && (
          <div className="section-title mb-1.5">{eyebrow}</div>
        )}
        <h2 className="text-base sm:text-lg font-semibold tracking-tight text-[var(--foreground)]">
          {title}
        </h2>
        {description && (
          <p className="text-xs text-[var(--muted)] mt-0.5 max-w-xl">
            {description}
          </p>
        )}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}
