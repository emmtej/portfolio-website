import { useEffect, useState } from "react";
import { TabButton } from "../ui/Tabs";
import { AboutTab } from "./about/AboutTab";
import { DevelopmentTab } from "./development/DevelopmentTab";
import { AudioTab } from "./audio/AudioTab";

const TABS = [
  {
    id: "about",
    label: "About",
    content: <AboutTab />,
  },
  {
    id: "development",
    label: "Development",
    content: (
      <div className="animate-in fade-in duration-500">
        <DevelopmentTab />
      </div>
    ),
  },
  {
    id: "audio",
    label: "Audio Mixing & Mastering",
    content: <AudioTab />,
  },
];

export function Tabs() {
  const [activeTabId, setActiveTabId] = useState(() => {
    // Initialize from URL path or default to first tab
    if (typeof window !== "undefined") {
      const path = window.location.pathname.replace(/^\//, "");
      if (path && TABS.some((t) => t.id === path)) {
        return path;
      }
    }
    return TABS[0].id;
  });

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\//, "");
      if (path && TABS.some((t) => t.id === path)) {
        setActiveTabId(path);
      } else {
        setActiveTabId(TABS[0].id);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleTabChange = (id: string) => {
    setActiveTabId(id);
    const newPath = `/${id}`;
    if (window.location.pathname !== newPath) {
      window.history.pushState({}, "", newPath);
    }
  };

  const activeTab = TABS.find((tab) => tab.id === activeTabId);

  return (
    <div className="w-full">
      <div className="border-b border-gray-100">
        <nav role="tablist" className="flex gap-2">
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

      <div
        id={`panel-${activeTabId}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTabId}`}
        className="mt-6"
      >
        {activeTab?.content}
      </div>
    </div>
  );
}

