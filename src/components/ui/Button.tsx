import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "../../utils/cn";
import { DURATIONS, EASE_OUT_QUART } from "../../utils/motion-variants";

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
  Omit<HTMLMotionProps<"button">, keyof SharedButtonProps | "children"> & {
    as?: "button";
  };

type ButtonAsAnchor = SharedButtonProps &
  Omit<HTMLMotionProps<"a">, keyof SharedButtonProps | "children"> & {
    as: "a";
    href?: string;
    target?: string;
    rel?: string;
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
      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    );
  }

  if (isSuccess) {
    return (
      <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </motion.svg>
    );
  }

  return null;
}

function PrimaryHoverOverlay() {
  return (
    <motion.div
      initial={{ y: "100%" }}
      whileHover={{ y: 0 }}
      transition={{ duration: DURATIONS.normal, ease: EASE_OUT_QUART }}
      className="absolute inset-0 bg-white/5"
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
      "relative flex items-center justify-center gap-2 font-bold uppercase tracking-[0.15em] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden",
      variantStyles[variant],
      sizeStyles[size],
      className
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
        <motion.a
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={baseClassName}
          {...(rest as Omit<HTMLMotionProps<"a">, "children">)}
        >
          {content}
        </motion.a>
      );
    }

    const { disabled, ...buttonRest } = rest as Omit<ButtonAsButton, keyof SharedButtonProps | "as">;
    const isDisabled = disabled || isLoading || isSuccess;

    return (
      <motion.button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={baseClassName}
        disabled={isDisabled}
        {...(buttonRest as Omit<HTMLMotionProps<"button">, "children" | "disabled">)}
      >
        {content}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
