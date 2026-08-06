import { motion, useReducedMotion, type Variants } from "framer-motion";
import React, { useEffect, useId, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../utils/cn";
import { CloseIcon } from "./icons/CloseIcon";
import { Heading } from "./Typography";
import {
  EASE_IN_QUART,
  EASE_OUT_QUART,
  MODAL_DURATIONS,
} from "../../utils/motion-tokens";

const backdropVariants = {
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

const panelVariants = {
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

const reducedPanelVariants = {
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

interface ModalProps {
  onClose: () => void;
  title: string;
  closeLabel: string;
  children: React.ReactNode;
  className?: string;
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  );
}

export const Modal = ({
  onClose,
  title,
  closeLabel,
  children,
  className,
}: ModalProps) => {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Move focus into the dialog once mounted. The presence owner restores it
  // after the exit animation completes.
  useLayoutEffect(() => {
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Tab trapping
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = getFocusableElements(dialog);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    dialog.addEventListener("keydown", handleTabKey);
    return () => dialog.removeEventListener("keydown", handleTabKey);
  }, []);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <motion.div
        aria-hidden="true"
        data-modal-backdrop=""
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      {/* Modal Content */}
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        variants={shouldReduceMotion ? reducedPanelVariants : panelVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className={cn(
          "relative w-full max-w-2xl bg-bg-app overflow-hidden shadow-2xl border border-border-subtle",
          className,
        )}
      >
        <div className="flex max-h-[90vh] flex-col">
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border-subtle px-6 py-4 md:px-8 md:py-5">
            <Heading
              as="h2"
              id={titleId}
              className="min-w-0 break-words pt-2"
            >
              {title}
            </Heading>

            <button
              ref={closeButtonRef}
              type="button"
              aria-label={closeLabel}
              onClick={onClose}
              className="flex size-12 shrink-0 items-center justify-center border border-border-subtle bg-bg-app text-text-secondary transition-colors hover:text-text-main focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-main"
            >
              <CloseIcon />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        </div>
      </motion.div>
    </div>,
    document.body,
  );
};
