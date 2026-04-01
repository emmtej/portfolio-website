import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { cn } from "../../utils/cn";

const SKILLS = [
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Next.js",
  "Framer Motion",
  "Node.js",
  "Prisma",
  "PostgreSQL",
  "GraphQL",
  "Docker",
  "Git",
  "Vite",
  "Redux",
  "Zustand",
  "Mantine UI",
  "Express",
  "CSS/SCSS",
  "HTML5",
  "JavaScript",
];

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function SkillsCarousel() {
  const { i18n, t } = useTranslation();
  const isIt = i18n.language.startsWith("it");
  const matteColors = ["bg-it-sage", "bg-it-cream", "bg-it-rose"];

  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false,
  );

  const duplicatedSkills = [...SKILLS, ...SKILLS];

  return (
    <section className="w-full overflow-hidden py-4 select-none">
      <h2 className="uppercase font-semibold tracking-[0.1em] text-text-main/80 text-xs mb-6 px-0">
        {t("dev.skills_title")}
      </h2>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-bg-app to-transparent z-10 pointer-events-none max-md:hidden" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-bg-app to-transparent z-10 pointer-events-none max-md:hidden" />

        <div className="relative flex">
          {prefersReducedMotion ? (
            <div className="flex flex-wrap gap-4">
              {SKILLS.map((skill, index) => (
                <div
                  key={skill}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2.5 border border-border-subtle bg-bg-app",
                    isIt && matteColors[index % matteColors.length],
                  )}
                >
                  <span className="text-sm font-bold uppercase tracking-wider text-text-main/60 whitespace-nowrap">
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              className="flex gap-4 pr-4"
              animate={{
                x: ["0%", "-50%"],
              }}
              transition={{
                duration: 80,
                ease: "linear",
                repeat: Infinity,
              }}
            >
              {duplicatedSkills.map((skill, index) => (
                <motion.div
                  key={`${skill}-${index}`}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2.5 border border-border-subtle bg-bg-app hover:border-text-main/20 hover:bg-text-main/[0.02] transition-colors duration-100 cursor-default",
                    isIt && matteColors[index % matteColors.length],
                  )}
                >
                  <span className="text-sm font-bold uppercase tracking-wider text-text-main/60 whitespace-nowrap">
                    {skill}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
