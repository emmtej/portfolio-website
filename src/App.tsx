import { useTranslation } from "react-i18next";
import { Layout } from "./components/Layout";
import { Tabs } from "./components/Tabs";
import { cn } from "./utils/cn";
import { HeaderLink, HeaderSeparator } from "./components/ui/HeaderLink";

function App() {
  const { t, i18n } = useTranslation();
  const isIt = i18n.language === "it";

  return (
    <Layout>
      <div className="w-full">
        <Tabs
          header={
            <header className="space-y-8 md:space-y-12">
              <div className="flex items-center gap-4 text-xs md:text-sm font-mono uppercase tracking-widest text-text-muted">
                <HeaderLink
                  href="https://github.com/emmtej"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  [GH].EMMTEJ
                </HeaderLink>
                <HeaderSeparator />
                <HeaderLink href="mailto:contact@emmanueltejeda.com">
                  [EMAIL].CONTACT
                </HeaderLink>
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
          }
        />
      </div>
    </Layout>
  );

}

export default App;
