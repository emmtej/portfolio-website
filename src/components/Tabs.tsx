import { useEffect, useState } from "react";
import { TabButton } from "../ui/Tabs";
import { AboutTab } from "./about/AboutTab";
import { DevelopmentTab } from "./development/DevelopmentTab";
import { AudioTab } from "./audio/AudioTab";
import { ContactTab } from "./contact/ContactTab";

const TABS = [
  {
    id: "about",
    label: "About",
    Component: AboutTab,
  },
  {
    id: "development",
    label: "Development",
    Component: DevelopmentTab,
    wrapperClass: "animate-in fade-in duration-500",
  },
  {
    id: "audio",
    label: "Audio Mixing & Mastering",
    Component: AudioTab,
  },
  {
    id: "contact",
    label: "Contact",
    Component: ContactTab,
  },
];

export function Tabs() {
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
  }, []);

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

      <div className="mt-6">
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
              className={`${isActive ? "block" : "hidden"} ${
                tab.wrapperClass || ""
              }`}
            >
              <tab.Component />
            </div>
          );
        })}
      </div>
    </div>
  );
}
