import { useReducedMotion } from "framer-motion";
import React, { useId, useRef } from "react";
import { createPortal } from "react-dom";
import { useModalDialog } from "../../hooks/useModalDialog";
import { ModalOverlay } from "./ModalOverlay";
import { ModalPanel } from "./ModalPanel";

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
  const shouldReduceMotion = useReducedMotion();

  useModalDialog({ dialogRef, closeButtonRef, onClose });

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <ModalOverlay onClose={onClose} />
      <ModalPanel
        dialogRef={dialogRef}
        closeButtonRef={closeButtonRef}
        title={title}
        titleId={titleId}
        closeLabel={closeLabel}
        className={className}
        shouldReduceMotion={shouldReduceMotion}
        onClose={onClose}
      >
        {children}
      </ModalPanel>
    </div>,
    document.body,
  );
};
