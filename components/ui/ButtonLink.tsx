import Link from "next/link";
import type { ReactNode } from "react";

export type ButtonVariant = "primary" | "outline" | "whatsapp" | "light";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan disabled:opacity-40";

/** Literal class strings per variant (never build these by concatenation). */
const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-primary text-surface hover:bg-primary/85",
  outline: "border border-line bg-surface text-primary hover:border-primary",
  whatsapp: "bg-[#25D366] text-white hover:brightness-95",
  light: "bg-surface text-primary hover:bg-surface/85",
};

/** Shared button look for <button>s and links. */
export function buttonClass(variant: ButtonVariant = "primary", extra = ""): string {
  return `${BASE} ${VARIANTS[variant]} ${extra}`.trim();
}

export default function ButtonLink({
  href,
  variant = "primary",
  className = "",
  external = false,
  children,
}: {
  href: string;
  variant?: ButtonVariant;
  className?: string;
  /** Opens in a new tab (WhatsApp, socials). */
  external?: boolean;
  children: ReactNode;
}) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass(variant, className)}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={buttonClass(variant, className)}>
      {children}
    </Link>
  );
}
