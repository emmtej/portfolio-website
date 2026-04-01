import { useTranslation } from "react-i18next";
import { Layout } from "./components/Layout";
import { Tabs } from "./components/Tabs";
import { cn } from "./utils/cn";

function App() {
  const { t, i18n } = useTranslation();
  const isIt = i18n.language === "it";

  return (
    <Layout>
      <div className="space-y-8">
        <header className="space-y-8 md:space-y-12">
          <div className="flex items-center gap-4 text-xs md:text-sm font-mono uppercase tracking-widest text-text-muted">
            <a
              href="https://github.com/emmtej"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text-main transition-colors duration-fast"
            >
              [GH].EMMTEJ
            </a>
            <span className="opacity-40 text-sm font-sans">//</span>
            <a
              href="mailto:contact@emmanueltejeda.com"
              className="hover:text-text-main transition-colors duration-fast"
            >
              [EMAIL].CONTACT
            </a>
          </div>
          <h1 className="text-6xl font-bold tracking-tight text-text-main leading-[0.85]">
            {t("app.title.greeting")
              .split(" ")
              .map((word, i) => (
                <span
                  key={i}
                  className={cn(
                    "transition-all duration-slow mr-3",
                    isIt && i === 0 && "text-it-green",
                    isIt && i === 1 && "text-it-red",
                  )}
                >
                  {word}
                </span>
              ))}
            <br />
            <span className="text-text-main">Emmanuel</span>
          </h1>
        </header>
        <div className="w-full">
          <Tabs />
        </div>
      </div>
    </Layout>
  );
}

export default App;
