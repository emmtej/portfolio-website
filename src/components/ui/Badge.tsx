import React from "react";
import { cn } from "../../utils/cn";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "outline" | "subtle" | "ghost";
  size?: "xs" | "sm";
  className?: string;
}

export const Badge = ({
  children,
  variant = "subtle",
  size = "sm",
  className,
}: BadgeProps) => {
  const variantStyles = {
    outline: "border border-border-subtle text-text-muted/80",
    subtle: "bg-border-subtle text-text-muted/80",
    ghost: "text-text-muted/60 hover:text-text-main transition-colors",
  };

  const sizeStyles = {
    xs: "px-2 py-0.5 text-[10px]",
    sm: "px-2.5 py-1 text-xs",
  };

  return (
    <span
      className={cn(
        "font-bold uppercase tracking-wider inline-flex items-center",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
    >
      {children}
    </span>
  );
};
