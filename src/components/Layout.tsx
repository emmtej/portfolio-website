import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface LayoutProps {
  children: ReactNode;
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
    <main className="min-h-screen px-6 pb-6 md:px-12 md:pb-12 lg:px-16 lg:pb-16 flex justify-center">
      <div className="w-full max-w-4xl flex flex-col relative">
        <motion.div 
          className="fixed top-4 right-4 md:top-6 md:right-6 flex items-center gap-2 md:gap-4 z-50 scale-90 md:scale-100 origin-top-right"
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
