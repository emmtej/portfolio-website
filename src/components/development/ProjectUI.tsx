import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { cn } from "../../utils/cn";
import { useEffect, useLayoutEffect, useRef } from "react";

export interface Project {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  tech: string[];
  features: string[];
  link?: string;
  github?: string;
}

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const { t } = useTranslation();

  return (
    <motion.button
      type="button"
      layoutId={`card-${project.id}`}
      onClick={onClick}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 32,
      }}
      whileHover={{
        y: -8,
        transition: { type: "spring", stiffness: 400, damping: 25 },
      }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "text-left w-full group relative cursor-pointer overflow-hidden border border-border-subtle bg-bg-app",
        "hover:border-text-main/20 hover:shadow-2xl hover:shadow-text-main/[0.04]",
      )}
    >
      {/* Visual Preview Area - Full Width */}
      <div className="aspect-[16/10] w-full bg-gradient-to-br from-text-main/5 to-text-main/10 relative overflow-hidden border-b border-border-subtle transition-colors duration-slow group-hover:from-text-main/[0.07] group-hover:to-text-main/[0.12]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] opacity-40 transition-opacity duration-slow group-hover:opacity-60" />

          <div className="relative flex flex-col items-center gap-2">
            <span className="text-lg font-bold tracking-tighter text-text-main/10 group-hover:text-text-main/20 transition-all duration-slow ease-out">
              {project.title}
            </span>
            <div className="px-3 py-1 bg-text-main/5 border border-text-main/10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-slow delay-75">
              <span className="text-xs font-bold uppercase tracking-widest text-text-main/40">
                {t("dev.view_project")}
              </span>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-slow" />
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-text-main tracking-tight transition-colors duration-normal">
              {project.title}
            </h3>
            <p className="text-sm text-text-muted/80 leading-relaxed tracking-tight max-w-lg">
              {project.shortDesc}
            </p>
          </div>

          <motion.div
            whileHover={{ x: 4 }}
            className="mt-1 size-8 border border-border-subtle flex items-center justify-center text-text-muted/40 group-hover:border-text-main/20 group-hover:text-text-main/60 transition-all duration-normal"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          </motion.div>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.tech.map((techItem) => (
            <span
              key={techItem}
              className="text-xs font-bold px-2.5 py-1 bg-border-subtle text-text-muted/80 uppercase tracking-wider group-hover:bg-text-main/5 group-hover:text-text-main/60 transition-colors duration-normal"
            >
              {techItem}
            </span>
          ))}
        </div>
      </div>
    </motion.button>
  );
}

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  );
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    closeButtonRef.current?.focus();
    return () => {
      previousFocusRef.current?.focus();
    };
  }, [project.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

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
  }, [project.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
      />

      <motion.div
        ref={dialogRef}
        layoutId={`card-${project.id}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 32,
        }}
        className="relative w-full max-w-2xl bg-bg-app overflow-hidden shadow-2xl border border-border-subtle"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label={t("dev.close_modal")}
          className="absolute top-4 right-4 z-10 p-2 bg-bg-app/80 backdrop-blur-md border border-border-subtle text-text-muted hover:text-text-main transition-colors"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>

        <div className="flex flex-col h-full max-h-[90vh] overflow-y-auto">
          <div className="h-64 shrink-0 bg-gradient-to-br from-text-main/5 to-text-main/10 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] opacity-50" />
            <h2 className="text-xl font-bold tracking-tighter text-text-main/30">
              {project.title}
            </h2>
          </div>

          <div className="p-8 space-y-8">
            <div className="space-y-4">
              <h3 id="modal-title" className="text-lg font-bold tracking-tight text-text-main">
                {project.title}
              </h3>
              <p className="text-md leading-relaxed text-text-muted tracking-tight">
                {project.fullDesc}
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="uppercase font-semibold tracking-wide text-text-main/80 text-sm">
                {t("dev.features_title")}
              </h4>
              <ul className="grid grid-cols-1 gap-3">
                {project.features.map((feature, index) => (
                  <li
                    key={`${feature}-${index}`}
                    className="flex items-start gap-3 text-sm text-text-muted tracking-tight"
                  >
                    <span className="mt-1.5 size-1.5 shrink-0 bg-text-main/20" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 pt-4 border-t border-border-subtle">
              <h4 className="uppercase font-semibold tracking-wide text-text-main/80 text-sm">
                {t("dev.tech_stack")}
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((techItem) => (
                  <span
                    key={techItem}
                    className="text-sm font-semibold px-3 py-1 bg-border-subtle text-text-main/60 uppercase tracking-wider"
                  >
                    {techItem}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-6">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 bg-text-main text-bg-app text-sm font-semibold tracking-tight hover:opacity-90 transition-opacity"
                >
                  {t("dev.view_source")}
                </a>
              )}
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 border border-border-subtle text-text-main text-sm font-semibold tracking-tight hover:border-text-main/40 transition-colors"
                >
                  {t("dev.view_demo")}
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
