import React from "react";
import { cn } from "../../utils/cn";
import { sectionWidths, styles, type SectionWidth } from "./primitives.tokens";
import { Text } from "./Typography";

// --- Section ---
interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  width?: SectionWidth;
}

export const Section: React.FC<SectionProps> = ({ title, children, className, width = "default" }) => (
  <section className={cn("space-y-6 md:space-y-8", sectionWidths[width], className)}>
    {title ? <Text variant="h2">{title}</Text> : null}
    {children}
  </section>
);

// --- Badge ---
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof styles.badge.variants;
  size?: keyof typeof styles.badge.sizes;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = "subtle", size = "sm", className, ...props }) => (
  <span
    className={cn(
      "font-bold uppercase tracking-wider inline-flex items-center",
      styles.badge.variants[variant],
      styles.badge.sizes[size],
      className
    )}
    {...props}
  >
    {children}
  </span>
);

// --- ChromeControl ---
interface ChromeControlProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
}

export const ChromeControl: React.FC<ChromeControlProps> = ({ children, className, as: Component = "div", ...props }) => (
  <Component
    className={cn(
      "inline-flex items-center gap-2 px-3 h-chrome-control min-h-chrome-control text-xs font-bold uppercase tracking-widest text-text-main pointer-events-auto",
      className
    )}
    {...props}
  >
    {children}
  </Component>
);
