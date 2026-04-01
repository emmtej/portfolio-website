import { useEffect, useState, useMemo, useRef } from "react";
import type React from "react";
import { useTranslation } from "react-i18next";
import { motion, type Variants } from "framer-motion";
import { cn } from "../utils/cn";
import { TabButton } from "./ui/Tabs";

// Static imports for tab components
import { AboutTab } from "./about/AboutTab";
import { DevelopmentTab } from "./development/DevelopmentTab";
import { AudioTab } from "./audio/AudioTab";
import { ContactTab } from "./contact/ContactTab";

const fadeInBorder: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { duration: 0.8, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }
  }
};

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

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\//, "");
      const targetId =
        path && TABS.some((t) => t.id === path) ? path : TABS[0].id;
      setActiveTabId(targetId);
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
    const newPath = `/${id}`;
    if (window.location.pathname !== newPath) {
      window.history.pushState({}, "", newPath);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    const currentIndex = TABS.findIndex(t => t.id === activeTabId);
    let nextIndex = currentIndex;

    if (e.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % TABS.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + TABS.length) % TABS.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = TABS.length - 1;
    }

    if (nextIndex !== currentIndex) {
      e.preventDefault();
      const nextTab = TABS[nextIndex];
      handleTabChange(nextTab.id);
      tabRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className="w-full">
      <motion.div 
        className={cn(
          "border-b border-border-subtle bg-bg-app z-40",
          header ? "sticky top-0 pt-8 md:pt-16 lg:pt-24" : "sticky top-0 pt-4"
        )}
        initial="hidden"
        animate="visible"
        variants={fadeInBorder}
      >

        {header && <div className="mb-8 md:mb-12">{header}</div>}
        <motion.nav 
          role="tablist" 
          className="flex gap-6"
          initial="hidden"
          animate="visible"
          variants={fadeInRest}
          onKeyDown={handleKeyDown}
        >
          {TABS.map((tab, index) => (
            <TabButton
              key={tab.id}
              ref={(el) => { tabRefs.current[index] = el; }}
              id={tab.id}
              label={tab.label}
              isActive={activeTabId === tab.id}
              onClick={handleTabChange}
            />
          ))}
        </motion.nav>
      </motion.div>

      <motion.div 
        className="mt-8" 
        initial="hidden"
        animate="visible"
        variants={fadeInRest}
      >
        {TABS.map((tab) => {
          const isActive = activeTabId === tab.id;

          return (
            <div
              key={tab.id}
              id={`panel-${tab.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${tab.id}`}
              className={cn(isActive ? "block" : "hidden", tab.wrapperClass)}
            >
              <tab.Component />
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

