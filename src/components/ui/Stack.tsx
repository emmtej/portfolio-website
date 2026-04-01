import React from "react";
import { cn } from "../../utils/cn";

interface StackProps {
  children: React.ReactNode;
  direction?: "row" | "col";
  gap?: number | string;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between";
  className?: string;
}

export const Stack = ({
  children,
  direction = "col",
  gap = 4,
  align = "stretch",
  justify = "start",
  className,
}: StackProps) => {
  const directionStyles = {
    row: "flex-row",
    col: "flex-col",
  };

  const alignStyles = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  };

  const justifyStyles = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
  };

  // Simplified gap mapping for tailwind
  const gapClass = typeof gap === "number" ? `gap-${gap}` : gap;

  return (
    <div
      className={cn(
        "flex",
        directionStyles[direction],
        alignStyles[align],
        justifyStyles[justify],
        gapClass,
        className,
      )}
    >
      {children}
    </div>
  );
};
