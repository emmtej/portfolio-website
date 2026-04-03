import { cn } from "../../utils/cn";
import type React from "react";

interface BaseProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export const Text = ({ children, className, as: Component = "p" }: BaseProps) => {
  return (
    <Component
      className={cn(
        "text-base md:text-md text-text-main/70 leading-relaxed tracking-tight whitespace-pre-line",
        className,
      )}
    >
      {children}
    </Component>
  );
};

export const Title = ({ children, className, as: Component = "h2" }: BaseProps) => {
  return (
    <Component
      className={cn(
        "uppercase font-bold tracking-[0.2em] text-text-main/40 text-xs md:text-sm",
        className,
      )}
    >
      {children}
    </Component>
  );
};

interface LabelProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  as?: React.ElementType;
  size?: "tiny" | "xs" | "sm";
  color?: "muted" | "main" | "error";
  mono?: boolean;
}

/**
 * Label is used for small, uppercase, tracked text.
 * Common in headers, metadata, and form labels.
 */
export const Label = ({
  children,
  className,
  as: Component = "span",
  size = "xs",
  color = "muted",
  mono = true,
  ...props
}: LabelProps) => {
  const sizeStyles = {
    tiny: "text-tiny",
    xs: "text-xs",
    sm: "text-sm",
  };

  const colorStyles = {
    muted: "text-text-muted",
    main: "text-text-main",
    error: "text-it-red",
  };

  return (
    <Component
      className={cn(
        "uppercase tracking-widest transition-colors",
        mono && "font-mono",
        sizeStyles[size],
        colorStyles[color],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

interface CaptionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  as?: React.ElementType;
  size?: "tiny" | "xs";
}

/**
 * Caption is used for very small, descriptive text.
 */
export const Caption = ({
  children,
  className,
  as: Component = "span",
  size = "tiny",
  ...props
}: CaptionProps) => {
  const sizeStyles = {
    tiny: "text-tiny",
    xs: "text-xs",
  };

  return (
    <Component
      className={cn(
        "text-text-muted/60 leading-tight",
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

