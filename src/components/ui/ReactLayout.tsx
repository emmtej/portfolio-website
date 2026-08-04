import React from "react";
import { cn } from "../../utils/cn";
import { sectionWidths, styles, type SectionWidth } from "./primitives.tokens";
import { Text, Heading } from "./Typography";

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

// --- ListRow ---
interface ListRowProps extends React.HTMLAttributes<HTMLElement> {
  prefix?: React.ReactNode;
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
  interactive?: boolean;
}

export const ListRow: React.FC<ListRowProps> = ({ prefix, title, subtitle, trailing, onClick, className, interactive = false, ...props }) => {
  const Component = onClick ? "button" : "div";
  return (
    <Component
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 py-3.5 border-b border-border-subtle text-left w-full transition-colors duration-normal",
        interactive && "group hover:bg-text-main/[0.02] cursor-pointer",
        className
      )}
      {...props}
    >
      {prefix ? (
        <div className={cn(
          "flex shrink-0 items-center justify-center min-w-[2rem] text-text-muted/60 transition-colors",
          interactive && "group-hover:text-text-main",
        )}>
          {prefix}
        </div>
      ) : null}
      <div className="flex-1 min-w-0">
        <Heading className={cn("truncate transition-colors", interactive && "group-hover:text-text-main")}>{title}</Heading>
        {subtitle ? <Text className="text-sm text-text-muted/60 truncate mt-0.5">{subtitle}</Text> : null}
      </div>
      {trailing ? <div className="flex shrink-0 items-center gap-3">{trailing}</div> : null}
    </Component>
  );
};
