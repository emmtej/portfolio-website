import { cn } from "../../utils/cn";
import type React from "react";

interface HeaderLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}

export function HeaderLink({
  href,
  children,
  className,
  target,
  rel,
}: HeaderLinkProps) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={cn(
        "hover:text-text-main transition-colors duration-fast",
        className,
      )}
    >
      {children}
    </a>
  );
}

export function HeaderSeparator() {
  return <span className="opacity-40 text-sm font-sans">//</span>;
}
