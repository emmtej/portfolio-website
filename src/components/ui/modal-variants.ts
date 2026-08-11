import { type Variants } from "framer-motion";
import {
  EASE_IN_QUART,
  EASE_OUT_QUART,
  MODAL_DURATIONS,
} from "../../utils/motion-tokens";

export const backdropVariants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: MODAL_DURATIONS.backdropExit,
      ease: EASE_IN_QUART,
    },
  },
  visible: {
    opacity: 1,
    transition: {
      duration: MODAL_DURATIONS.backdropEnter,
      ease: EASE_OUT_QUART,
    },
  },
} satisfies Variants;

export const panelVariants = {
  hidden: {
    opacity: 0,
    y: 12,
    scale: 0.985,
    transition: {
      duration: MODAL_DURATIONS.panelExit,
      ease: EASE_IN_QUART,
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: MODAL_DURATIONS.panelEnter,
      ease: EASE_OUT_QUART,
    },
  },
} satisfies Variants;

export const reducedPanelVariants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: MODAL_DURATIONS.panelExit,
      ease: EASE_IN_QUART,
    },
  },
  visible: {
    opacity: 1,
    transition: {
      duration: MODAL_DURATIONS.panelEnter,
      ease: EASE_OUT_QUART,
    },
  },
} satisfies Variants;
