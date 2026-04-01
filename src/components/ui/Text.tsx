import { cn } from "../../utils/cn";
import type React from "react";

interface BaseProps {
  children: React.ReactNode;
  className?: string;
}

type TextProps = BaseProps;

type TitleProps = BaseProps;

export const Text = ({ children, className }: TextProps) => {
  return (
    <p
      className={cn(
        "text-base md:text-md text-text-main/70 leading-relaxed tracking-tight whitespace-pre-line",
        className,
      )}
    >
      {children}
    </p>
  );
};

export const Title = ({ children, className }: TitleProps) => {
  return (
    <h2
      className={cn(
        "uppercase font-bold tracking-[0.2em] text-text-main/40 text-xs md:text-sm",
        className,
      )}
    >
      {children}
    </h2>
  );
};
