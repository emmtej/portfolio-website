import React from "react";
import { cn } from "../../../utils/cn";
import { styles } from "../primitives.tokens";

type TextVariant = keyof typeof styles.text.variants;
type TextSize = keyof typeof styles.text.sizes;
type TextColor = keyof typeof styles.text.colors;

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  variant?: TextVariant;
  size?: TextSize;
  color?: TextColor;
  mono?: boolean;
}

function resolveDefaultSize(variant: TextVariant): TextSize | undefined {
  if (variant === "body") return "base";
  if (variant === "caption") return "tiny";
  if (variant === "detail") return "sm";
  if (variant === "h1" || variant === "h2" || variant === "h3") return undefined;
  return "xs";
}

function resolveDefaultElement(variant: TextVariant): React.ElementType {
  if (variant === "h1" || variant === "h2" || variant === "h3") return variant;
  if (variant === "body") return "p";
  return "span";
}

export const Text: React.FC<TextProps> = ({
  children,
  className: classNameProp,
  as,
  variant = "body",
  size,
  color,
  mono,
  ...props
}) => {
  const defaultSize = resolveDefaultSize(variant);
  const defaultColor = variant === "caption" ? "muted" : (variant === "body" ? "main" : "muted");
  const resolvedSize = size ?? defaultSize;
  const className = cn(
    styles.text.variants[variant],
    resolvedSize && styles.text.sizes[resolvedSize],
    styles.text.colors[color ?? (defaultColor as TextColor)],
    (mono || variant === "meta" || variant === "detail") && "font-mono",
    classNameProp,
  );

  return React.createElement(
    as ?? resolveDefaultElement(variant),
    { className, ...props },
    children,
  );
};
