/**
 * Shared easeOutQuart curve for premium UI feel.
 */
export const EASE_OUT_QUART = [0.21, 0.47, 0.32, 0.98] as [number, number, number, number];
export const EASE_IN_QUART = [0.5, 0, 0.75, 0] as [number, number, number, number];

export const DURATIONS = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8,
} as const;

export const MODAL_DURATIONS = {
  backdropEnter: 0.18,
  backdropExit: 0.15,
  panelEnter: 0.26,
  panelExit: 0.18,
} as const;
