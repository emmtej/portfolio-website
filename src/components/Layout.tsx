import { motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface LayoutProps {
  children: React.ReactNode;
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { duration: 1, delay: 0.5 } 
  }
};

export function Layout({ children }: LayoutProps) {
  return (
    <main className="min-h-screen px-8 pb-8 md:px-16 md:pb-16 lg:px-24 lg:pb-24 flex justify-center">
      <div className="w-full max-w-4xl flex flex-col relative">
        <motion.div 
          className="fixed top-6 right-6 flex items-center gap-4 z-50"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <LanguageSwitcher />
          <ThemeToggle />
        </motion.div>
        <div className="flex-1">{children}</div>
      </div>
    </main>
  );
}
