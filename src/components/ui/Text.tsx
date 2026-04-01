import { cn } from "../../utils/cn";
import type React from "react";

interface BaseProps {
  children: React.ReactNode;
  className?: string;
}

interface TextProps extends BaseProps {}

interface TitleProps extends BaseProps {}

export const Text = ({ children, className }: TextProps) => {
  return (
    <p
      className={cn(
        "text-md text-text-main/80 leading-relaxed tracking-tight whitespace-pre-line",
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
        "uppercase font-semibold tracking-wide text-text-main/80 text-sm",
        className,
      )}
    >
      {children}
    </h2>
  );
};
