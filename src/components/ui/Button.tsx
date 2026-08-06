import React from "react";
import { cn } from "../../utils/cn";

type ButtonVariant = "primary" | "outline";
type ButtonSize = "sm" | "md";

type SharedButtonProps = {
  /** Primary and outline styles used across the portfolio. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner and disables the button while true. */
  isLoading?: boolean;
  /**
   * Shows a check icon and disables the button while true.
   * Success is treated as a terminal state (button stays disabled).
   */
  isSuccess?: boolean;
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

function StatusIcon({ isLoading, isSuccess }: Pick<SharedButtonProps, "isLoading" | "isSuccess">) {
  if (isLoading) {
    return (
      <svg
        aria-hidden="true"
        className="size-4 animate-spin"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    );
  }

  if (isSuccess) {
    return (
      <svg
        aria-hidden="true"
        className="size-4 animate-button-success-pop motion-reduce:animate-none"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    );
  }

  return null;
}

function PrimaryHoverOverlay() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 translate-y-full bg-white/5 transition-transform duration-normal ease-[cubic-bezier(0.21,0.47,0.32,0.98)] group-hover:translate-y-0 group-focus-visible:translate-y-0 motion-reduce:transition-none"
    />
  );
}

function ButtonContent({
  variant,
  isLoading,
  isSuccess,
  children,
}: Pick<SharedButtonProps, "variant" | "isLoading" | "isSuccess" | "children">) {
  if (isLoading) {
    return (
      <span className="relative z-10 flex items-center gap-2">
        {children}
        <StatusIcon isLoading isSuccess={false} />
      </span>
    );
  }

  if (isSuccess) {
    return (
      <span className="relative z-10 flex items-center gap-2">
        {children}
        <StatusIcon isLoading={false} isSuccess />
      </span>
    );
  }

  return (
    <>
      {variant === "primary" && <PrimaryHoverOverlay />}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </>
  );
}

export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (allProps, ref) => {
    const {
      variant = "primary",
      size = "md",
      isLoading = false,
      isSuccess = false,
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
      <ButtonContent
        variant={variant}
        isLoading={isLoading}
        isSuccess={isSuccess}
      >
        {children}
      </ButtonContent>
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
    const isDisabled = disabled || isLoading || isSuccess;

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={baseClassName}
        disabled={isDisabled}
        {...buttonRest}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";
