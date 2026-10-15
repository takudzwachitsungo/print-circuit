type IconProps = { className?: string };

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function SearchIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...stroke}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function BagIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...stroke}>
      <path d="M6 7h12l1 13H5L6 7Z" />
      <path d="M9 7a3 3 0 0 1 6 0" />
    </svg>
  );
}

function PrinterIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...stroke}>
      <path d="M7 9V3h10v6" />
      <rect x="3" y="9" width="18" height="8" rx="2" />
      <path d="M7 14h10v7H7z" />
    </svg>
  );
}

function PenIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...stroke}>
      <path d="m12 19 7-7 3 3-7 7-3-3Z" />
      <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5Z" />
      <circle cx="11" cy="11" r="2" />
    </svg>
  );
}

function SignIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...stroke}>
      <path d="M12 3v18" />
      <path d="M5 6h12l3 3-3 3H5z" />
    </svg>
  );
}

function NotebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...stroke}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 3v18M12 8h4M12 12h4" />
    </svg>
  );
}

function MonitorIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...stroke}>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  );
}

/** One icon per SITE.services slug. */
export const CATEGORY_ICONS: Record<string, (p: IconProps) => React.JSX.Element> = {
  printing: PrinterIcon,
  "graphic-design-branding": PenIcon,
  "signage-advertising": SignIcon,
  "stationery-supplies": NotebookIcon,
  "web-development": MonitorIcon,
};
