import React from "react";
import { cn } from "../../utils/cn";

interface SurfaceProps {
  children: React.ReactNode;
  variant?: "flat" | "bordered" | "interactive";
  padding?: "none" | "sm" | "md" | "lg";
  className?: string;
  as?: React.ElementType;
}

export const Surface = ({
  children,
  variant = "bordered",
  padding = "md",
  className,
  as: Component = "div",
}: SurfaceProps) => {
  const variantStyles = {
    flat: "bg-bg-app",
    bordered: "bg-bg-app border border-border-subtle",
    interactive:
      "bg-bg-app border border-border-subtle hover:border-text-main/20 hover:bg-text-main/[0.02] transition-all duration-normal group",
  };

  const paddingStyles = {
    none: "",
    sm: "p-4",
    md: "p-6 md:p-8",
    lg: "p-8 md:p-12",
  };

  return (
    <Component
      className={cn(
        variantStyles[variant],
        paddingStyles[padding],
        className,
      )}
    >
      {children}
    </Component>
  );
};
