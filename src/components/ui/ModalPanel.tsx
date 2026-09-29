import React from "react";
import { cn } from "../../utils/cn";
import { CloseIcon } from "./icons/CloseIcon";
import { Heading } from "./Typography";

interface ModalPanelProps {
  title: string;
  titleId: string;
  closeLabel: string;
  className?: string;
  onClose: () => void;
  dialogRef: React.RefObject<HTMLDivElement | null>;
  closeButtonRef: React.RefObject<HTMLButtonElement | null>;
  children: React.ReactNode;
}

export function ModalPanel({
  title,
  titleId,
  closeLabel,
  className,
  onClose,
  dialogRef,
  closeButtonRef,
  children,
}: ModalPanelProps) {
  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className={cn(
        "relative w-full max-w-2xl bg-bg-app overflow-hidden shadow-2xl border border-border-subtle",
        className,
      )}
    >
      <div className="flex max-h-[90vh] flex-col">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border-subtle px-6 py-4 md:px-8 md:py-5">
          <Heading as="h2" id={titleId} className="min-w-0 break-words pt-2">
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
    </div>
  );
}
