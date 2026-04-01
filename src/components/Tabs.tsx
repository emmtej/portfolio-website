import { useEffect, useState, useMemo, lazy, Suspense, useCallback } from "react";
import type React from "react";
import { useTranslation } from "react-i18next";
import { motion, type Variants } from "framer-motion";
import { cn } from "../utils/cn";
import { TabButton } from "./ui/Tabs";

// Define dynamic loaders for each tab
const TAB_LOADERS = {
  about: () => import("./about/AboutTab").then((m) => ({ default: m.AboutTab })),
  development: () => import("./development/DevelopmentTab").then((m) => ({ default: m.DevelopmentTab })),
  audio: () => import("./audio/AudioTab").then((m) => ({ default: m.AudioTab })),
  contact: () => import("./contact/ContactTab").then((m) => ({ default: m.ContactTab })),
};

// Create lazy components
const AboutTab = lazy(TAB_LOADERS.about);
const DevelopmentTab = lazy(TAB_LOADERS.development);
const AudioTab = lazy(TAB_LOADERS.audio);
const ContactTab = lazy(TAB_LOADERS.contact);

const fadeInRest: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, delay: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }
  }
};

export function Tabs({ header }: { header?: React.ReactNode }) {
  const { t } = useTranslation();

  const TABS = useMemo(() => [
    {
      id: "about",
      label: t("nav.about"),
      Component: AboutTab,
    },
    {
      id: "development",
      label: t("nav.development"),
      Component: DevelopmentTab,
      wrapperClass: "animate-in fade-in duration-slow",
    },
    {
      id: "audio",
      label: t("nav.audio"),
      Component: AudioTab,
    },
    {
      id: "contact",
      label: t("nav.contact"),
      Component: ContactTab,
    },
  ], [t]);

  const [activeTabId, setActiveTabId] = useState(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname.replace(/^\//, "");
      if (path && TABS.some((t) => t.id === path)) {
        return path;
      }
    }
    return TABS[0].id;
  });

  // Track which tabs have been "visited" to implement lazy loading
  const [visitedTabs, setVisitedTabs] = useState<Set<string>>(
    new Set([activeTabId]),
  );

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\//, "");
      const targetId =
        path && TABS.some((t) => t.id === path) ? path : TABS[0].id;
      setActiveTabId(targetId);
      setVisitedTabs((prev) => {
        const next = new Set(prev);
        next.add(targetId);
        return next;
      });
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [TABS]);

  useEffect(() => {
    const activeTab = TABS.find((t) => t.id === activeTabId);
    if (activeTab) {
      document.title = `${activeTab.label} || Emmanuel T.`;
    }
  }, [activeTabId, TABS]);

  const handleTabChange = (id: string) => {
    setActiveTabId(id);
    setVisitedTabs((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    const newPath = `/${id}`;
    if (window.location.pathname !== newPath) {
      window.history.pushState({}, "", newPath);
    }
  };

  const handlePrefetch = useCallback((id: string) => {
    const loader = TAB_LOADERS[id as keyof typeof TAB_LOADERS];
    if (loader) {
      loader();
    }
  }, []);

  return (
    <div className="w-full">
      <div className={cn(
        "border-b border-border-subtle bg-bg-app z-40 transition-all duration-300",
        header ? "sticky top-0 pt-8 md:pt-16 lg:pt-24" : "sticky top-0 pt-4"
      )}>
        {header && <div className="mb-8 md:mb-12">{header}</div>}
        <motion.nav 
          role="tablist" 
          className="flex gap-6"
          initial="hidden"
          animate="visible"
          variants={fadeInRest}
        >
          {TABS.map((tab) => (
            <TabButton
              key={tab.id}
              id={tab.id}
              label={tab.label}
              isActive={activeTabId === tab.id}
              onClick={handleTabChange}
              onPrefetch={handlePrefetch}
            />
          ))}
        </motion.nav>
      </div>

      <motion.div 
        className="mt-8" 
        initial="hidden"
        animate="visible"
        variants={fadeInRest}
      >
        {TABS.map((tab) => {
          const isVisited = visitedTabs.has(tab.id);
          const isActive = activeTabId === tab.id;

          // Lazy load: Only render if visited at least once
          if (!isVisited) return null;

          return (
            <div
              key={tab.id}
              id={`panel-${tab.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${tab.id}`}
              className={cn(isActive ? "block" : "hidden", tab.wrapperClass)}
            >
              <Suspense fallback={<div className="h-40 flex items-center justify-center animate-pulse text-text-muted/40 font-mono text-xs uppercase tracking-widest">Loading...</div>}>
                <tab.Component />
              </Suspense>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
