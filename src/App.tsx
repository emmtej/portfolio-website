import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Layout } from "./components/Layout";
import { Tabs } from "./components/Tabs";
import { cn } from "./utils/cn";
import { HeaderLink, HeaderSeparator } from "./components/ui/HeaderLink";
import { fadeInRest, fadeInUp } from "./utils/motion-variants";

function App() {
  const { t, i18n } = useTranslation();
  const isIt = i18n.language.startsWith("it");

  return (
    <Layout>
      <div className="w-full">
        <Tabs
          header={
            <header className="space-y-6 md:space-y-8">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInRest}
                className="flex items-center gap-4 text-[10px] md:text-xs font-mono uppercase tracking-widest text-text-muted"
              >
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
              </motion.div>
              <motion.h1
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-text-main leading-[0.85]"
              >
                {t("app.title.greeting")
                  .split(" ")
                  .map((word, i) => (
                    <span
                      key={`${word}-${i}`}
                      className={cn(
                        "mr-3 transition-colors duration-slow",
                        isIt && i === 0 && "text-it-green",
                        isIt && i === 1 && "text-it-red",
                      )}
                    >
                      {word}
                    </span>
                  ))}
                <br />
                <span className="text-text-main">Emmanuel</span>
              </motion.h1>
            </header>
          }
        />
      </div>
    </Layout>
  );
}

export default App;
