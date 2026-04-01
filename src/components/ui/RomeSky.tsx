import { motion } from "framer-motion";
import type { RomeSkyPhase } from "../../utils/rome-sky-phase";

type RomeSkyProps = {
  phase: RomeSkyPhase;
  className?: string;
};

export function RomeSky({ phase, className }: RomeSkyProps) {
  return (
    <div className={className}>
      {phase === "dawn" && <DawnIcon />}
      {phase === "day" && <DayIcon />}
      {phase === "dusk" && <DuskIcon />}
      {phase === "night" && <NightIcon />}
    </div>
  );
}

function DawnIcon() {
  return (
    <motion.svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-it-red"
    >
      <path d="M12 10a4 4 0 0 1 4 4h-8a4 4 0 0 1 4-4Z" />
      <path d="m5 10 1.5 1.5" />
      <path d="M12 5v2" />
      <path d="m19 10-1.5 1.5" />
      <path d="M22 18H2" />
    </motion.svg>
  );
}

function DayIcon() {
  return (
    <motion.svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ opacity: 0, rotate: -90 }}
      animate={{ opacity: 1, rotate: 0 }}
      className="text-it-green"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </motion.svg>
  );
}

function DuskIcon() {
  return (
    <motion.svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-it-red"
    >
      <path d="M12 10a4 4 0 0 1 4 4h-8a4 4 0 0 1 4-4Z" />
      <path d="m5 15-1.5-1.5" />
      <path d="M12 20v-2" />
      <path d="m19 15 1.5-1.5" />
      <path d="M22 10H2" />
    </motion.svg>
  );
}

function NightIcon() {
  return (
    <motion.svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      className="text-text-muted"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </motion.svg>
  );
}
