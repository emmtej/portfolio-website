import { ThemeToggle } from "./ThemeToggle";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <main className="min-h-screen p-8 md:p-16 lg:p-24 flex justify-center">
      <div className="w-full max-w-6xl flex flex-col">
        <ThemeToggle />
        <div className="flex-1">{children}</div>
      </div>
    </main>
  );
}
