import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { AboutTab } from "./about/AboutTab";
import { DevelopmentTab } from "./development/DevelopmentTab";
import { AudioTab } from "./audio/AudioTab";
import { ContactTab } from "./contact/ContactTab";
import { cn } from "../utils/cn";
import { TabButton } from "./ui/Tabs";

export function Tabs() {
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

  return (
    <div className="w-full">
      <div className="border-b border-border-subtle">
        <nav role="tablist" className="flex gap-6">
          {TABS.map((tab) => (
            <TabButton
              key={tab.id}
              id={tab.id}
              label={tab.label}
              isActive={activeTabId === tab.id}
              onClick={handleTabChange}
            />
          ))}
        </nav>
      </div>

      <div className="mt-8">
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
              <tab.Component />
            </div>
          );
        })}
      </div>
    </div>
  );
}
