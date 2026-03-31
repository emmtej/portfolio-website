import clsx from "clsx";
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
      className={clsx(
        "text-[15px] text-text-main/80 space-y-5 leading-relaxed tracking-tight whitespace-pre-line",
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
      className={clsx(
        "uppercase font-semibold tracking-[0.1em] text-text-main/80 text-xs",
        className,
      )}
    >
      {children}
    </h2>
  );
};
