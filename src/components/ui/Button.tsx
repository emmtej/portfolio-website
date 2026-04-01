import { motion, type HTMLMotionProps } from "framer-motion";
import React from "react";
import { cn } from "../../utils/cn";

type ButtonVariant = "primary" | "outline" | "ghost" | "link";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isSuccess?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
  as?: React.ElementType;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-text-main text-bg-app hover:bg-text-main/90",
  outline: "border border-border-subtle text-text-main hover:border-text-main/40 hover:bg-text-main/[0.02]",
  ghost: "text-text-muted hover:text-text-main hover:bg-text-main/[0.05]",
  link: "text-text-main underline-offset-4 hover:underline p-0 h-auto",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-sm md:text-base",
  icon: "p-2",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      isSuccess = false,
      leftIcon,
      rightIcon,
      className,
      children,
      disabled,
      as: Component = "button",
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading || isSuccess;
    const MotionComponent = motion(Component);

    return (
      <MotionComponent
        ref={ref}
        whileHover={!isDisabled ? { y: -2 } : undefined}
        whileTap={!isDisabled ? { scale: 0.98 } : undefined}
        disabled={isDisabled}
        className={cn(
          "relative flex items-center justify-center gap-2 font-bold uppercase tracking-[0.15em] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {/* Hover Overlay for Primary */}
        {variant === "primary" && !isDisabled && (
          <motion.div
            initial={{ y: "100%" }}
            whileHover={{ y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 bg-white/5"
          />
        )}

        <span className="relative z-10 flex items-center gap-2">
          {leftIcon && !isLoading && <span className="shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && !isLoading && !isSuccess && (
            <span className="shrink-0">{rightIcon}</span>
          )}
        </span>

        {/* Success Icon Placeholder or implementation could go here */}
      </MotionComponent>
    );
  },
);

Button.displayName = "Button";
