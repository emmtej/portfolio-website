import React from "react";
import { cn } from "../../utils/cn";

type ButtonVariant = "primary" | "outline";
type ButtonSize = "sm" | "md";

type SharedButtonProps = {
  /** Primary and outline styles used across the portfolio. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: React.ReactNode;
  className?: string;
};

type ButtonAsButton = SharedButtonProps &
  Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    keyof SharedButtonProps | "children"
  > & {
    as?: "button";
  };

type ButtonAsAnchor = SharedButtonProps &
  Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    keyof SharedButtonProps | "children"
  > & {
    as: "a";
  };

type ButtonProps = ButtonAsButton | ButtonAsAnchor;

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-accent text-on-accent hover:opacity-90",
  outline: "border border-border-subtle text-text-main hover:border-text-main/40 hover:bg-text-main/[0.02]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
};

function PrimaryHoverOverlay() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 translate-y-full bg-white/5 transition-transform duration-normal ease-[cubic-bezier(0.21,0.47,0.32,0.98)] group-hover:translate-y-0 group-focus-visible:translate-y-0 motion-reduce:transition-none"
    />
  );
}

export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (allProps, ref) => {
    const {
      variant = "primary",
      size = "md",
      children,
      className,
      as = "button",
      ...rest
    } = allProps;

    const baseClassName = cn(
      "group relative flex items-center justify-center gap-2 overflow-hidden font-bold uppercase tracking-[0.15em] transition-[background-color,border-color,color,opacity] duration-normal disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-main",
      variantStyles[variant],
      sizeStyles[size],
      className,
    );

    const content = (
      <>
        {variant === "primary" && <PrimaryHoverOverlay />}
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </>
    );

    if (as === "a") {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={baseClassName}
          {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      );
    }

    const { disabled, ...buttonRest } =
      rest as React.ButtonHTMLAttributes<HTMLButtonElement>;

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={baseClassName}
        disabled={disabled}
        {...buttonRest}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";
