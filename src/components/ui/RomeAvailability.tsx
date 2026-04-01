import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/cn";
import {
  intlLocaleFromLanguage,
  useRomeAvailability,
} from "../../hooks/useRomeAvailability";
import { RomeSky } from "./RomeSky";

type RomeAvailabilityProps = {
  className?: string;
};

export function RomeAvailability({ className }: RomeAvailabilityProps) {
  const { t, i18n } = useTranslation();
  const intlLocale = intlLocaleFromLanguage(i18n.language);
  const {
    available,
    localRange,
    romeRange,
    localNext,
    countdown,
    romeTime,
    skyPhase,
    progress,
  } = useRomeAvailability(intlLocale);

  return (
    <div
      className={cn(
        "group flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-border-subtle py-4 md:py-5",
        className,
      )}
    >
      {/* Time & Sky Phase */}
      <div className="flex items-center gap-3">
        <div className="relative flex size-8 shrink-0 items-center justify-center border border-border-subtle bg-bg-app">
          <RomeSky phase={skyPhase} className="scale-75 opacity-70 group-hover:opacity-100 transition-opacity" />
          
          {/* Progress Indicator (Minimalist) */}
          <div className="absolute bottom-0 left-0 h-[2px] bg-border-subtle w-full">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              className={cn(
                "h-full transition-colors duration-500",
                available ? "bg-it-green" : "bg-it-red"
              )}
            />
          </div>
        </div>
        
        <div className="space-y-0.5">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-text-muted leading-none">
            Rome IT
          </p>
          <p className="font-mono text-xs font-medium tabular-nums text-text-main leading-none">
            {romeTime}
          </p>
        </div>
      </div>

      {/* Availability Status */}
      <div className="flex flex-1 min-w-[200px] items-center gap-3 border-l border-border-subtle pl-6 h-8">
        <span
          className={cn(
            "size-1.5 shrink-0",
            available
              ? "bg-it-green animate-rome-availability-pulse"
              : "bg-it-red/60",
          )}
        />
        <div className="space-y-0.5 overflow-hidden">
          <p className="text-[11px] font-bold uppercase tracking-wider text-text-main leading-none">
            <AnimatePresence mode="wait">
              <motion.span
                key={available ? "available" : "away"}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
              >
                {available 
                  ? t("contact.availability.available_short")
                  : t("contact.availability.away_short")
                }
              </motion.span>
            </AnimatePresence>
          </p>
          <p className="text-[10px] text-text-muted/80 truncate leading-none">
            {available
              ? t("contact.availability.available", {
                  localWindow: localRange,
                  romeWindow: romeRange,
                })
              : t("contact.availability.away", { localNext, countdown })}
          </p>
        </div>
      </div>
    </div>
  );
}
