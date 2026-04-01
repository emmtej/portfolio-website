import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Layout } from "./components/Layout";
import { Tabs } from "./components/Tabs";
import { cn } from "./utils/cn";
import { HeaderLink, HeaderSeparator } from "./components/ui/HeaderLink";

const fadeInUp = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

const fadeInRest = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

function App() {
  const { t, i18n } = useTranslation();
  const isIt = i18n.language === "it";

  return (
    <Layout>
      <div className="w-full">
        <Tabs
          header={
            <header className="space-y-8 md:space-y-12">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInRest}
                className="flex items-center gap-4 text-xs font-mono uppercase tracking-widest text-text-muted"
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
                className="text-6xl font-bold tracking-tight text-text-main leading-[0.85]"
              >
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
              </motion.h1>
            </header>
          }
        />
      </div>
    </Layout>
  );
}

export default App;
