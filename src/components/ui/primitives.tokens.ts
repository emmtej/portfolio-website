export const styles = {
  text: {
    variants: {
      body: "leading-relaxed tracking-tight whitespace-pre-line",
      label: "uppercase tracking-widest transition-colors",
      meta: "uppercase tracking-wider font-mono",
      detail: "font-mono normal-case tracking-normal text-secondary leading-snug",
      eyebrow: "font-bold tracking-wide uppercase",
      caption: "text-text-secondary leading-tight",
      h1: "font-bold text-text-main tracking-tight text-[clamp(2.5rem,10vw,6rem)] leading-[0.85]",
      h2: "font-bold uppercase tracking-widest text-text-secondary text-xs md:text-sm",
      h3: "font-bold text-text-main tracking-tight text-base md:text-md",
    },
    sizes: {
      tiny: "text-tiny",
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      md: "text-md",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
    },
    colors: {
      main: "text-text-main",
      muted: "text-text-secondary",
      error: "text-it-red",
    },
  },
  badge: {
    variants: {
      outline: "border border-border-subtle text-text-secondary",
      subtle: "bg-surface-muted text-text-secondary",
      ghost: "text-text-tertiary hover:text-text-main transition-colors",
    },
    sizes: {
      xs: "px-2 py-0.5 text-[10px]",
      sm: "px-2.5 py-1 text-xs",
    },
  },
} as const;

export const sectionWidths = {
  default: "max-w-4xl",
  narrow: "max-w-3xl",
  wide: "max-w-5xl",
  full: "w-full",
} as const;

export type SectionWidth = keyof typeof sectionWidths;
