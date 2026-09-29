import { motion } from "framer-motion";
import React, { useId, useRef } from "react";
import { createPortal } from "react-dom";
import { useModalDialog } from "../../hooks/useModalDialog";
import { ModalPanel } from "./ModalPanel";

const EASE_OUT_QUART: [number, number, number, number] = [
  0.21, 0.47, 0.32, 0.98,
];
const EASE_IN_QUART: [number, number, number, number] = [0.5, 0, 0.75, 0];

interface ModalProps {
  onClose: () => void;
  title: string;
  closeLabel: string;
  children: React.ReactNode;
  className?: string;
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

  useModalDialog({ dialogRef, closeButtonRef, onClose });

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div
        aria-hidden="true"
        data-modal-backdrop=""
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <motion.div
        className="relative w-full max-w-2xl"
        initial={{ y: 12, scale: 0.985 }}
        animate={{
          y: 0,
          scale: 1,
          transition: { duration: 0.26, ease: EASE_OUT_QUART },
        }}
        exit={{
          y: 12,
          scale: 0.985,
          transition: { duration: 0.18, ease: EASE_IN_QUART },
        }}
      >
        <ModalPanel
          dialogRef={dialogRef}
          closeButtonRef={closeButtonRef}
          title={title}
          titleId={titleId}
          closeLabel={closeLabel}
          className={className}
          onClose={onClose}
        >
          {children}
        </ModalPanel>
      </motion.div>
    </div>,
    document.body,
  );
};
