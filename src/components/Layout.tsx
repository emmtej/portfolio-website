import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <main className="min-h-screen px-8 pb-8 md:px-16 md:pb-16 lg:px-24 lg:pb-24 flex justify-center">
      <div className="w-full max-w-4xl flex flex-col relative">
        <div className="fixed top-6 right-6 flex items-center gap-4 z-50">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </main>
  );
}
