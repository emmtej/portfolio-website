import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { cn } from "../../utils/cn";
import { Surface } from "../ui/Surface";
import { Label, Title } from "../ui/Text";

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

export function SkillsCarousel() {
  const { i18n, t } = useTranslation();
  const isIt = i18n.language.startsWith("it");
  const matteColors = ["bg-it-sage", "bg-it-cream", "bg-it-rose"];

  const trackRef = useRef<HTMLDivElement>(null);
  /** Half of duplicated track width in px — one seamless loop (matches former `x: "-50%"`). */
  const [loopWidthPx, setLoopWidthPx] = useState(0);

  const duplicatedSkills = useMemo(() => [...SKILLS, ...SKILLS], []);

  useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const measure = () => {
      const total = el.scrollWidth;
      setLoopWidthPx(total > 0 ? total / 2 : 0);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);

    // When the tab panel switches from `display: none` to visible, some engines
    // need an extra nudge after layout; IO covers that case.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) measure();
      },
      { threshold: 0 },
    );
    io.observe(el);

    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  const marqueeTransition = {
    duration: 40,
    ease: "linear" as const,
    repeat: Infinity,
    repeatType: "loop" as const,
  };

  return (
    <section className="w-full overflow-hidden py-2 select-none">
      <Title as="h2" className="mb-4 px-0 text-text-main/80">
        {t("dev.skills_title")}
      </Title>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-bg-app to-transparent z-10 pointer-events-none max-md:hidden" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-bg-app to-transparent z-10 pointer-events-none max-md:hidden" />

        <div className="relative">
          <motion.div
            ref={trackRef}
            className="flex w-max shrink-0 gap-4 pr-4 will-change-transform"
            initial={{ x: 0 }}
            animate={loopWidthPx > 0 ? { x: -loopWidthPx } : { x: 0 }}
            transition={marqueeTransition}
          >
            {duplicatedSkills.map((skill, index) => (
              <Surface
                key={`${skill}-${index}`}
                variant="interactive"
                padding="none"
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 cursor-default transition-colors duration-100",
                  isIt && matteColors[index % matteColors.length],
                )}
              >
                <Label
                  size="sm"
                  mono={false}
                  className="font-bold tracking-wider text-text-main/60 whitespace-nowrap"
                >
                  {skill}
                </Label>
              </Surface>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
