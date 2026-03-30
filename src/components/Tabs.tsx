import { useState } from "react";
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
  const [activeTabId, setActiveTabId] = useState(TABS[0].id);

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
              onClick={setActiveTabId}
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
