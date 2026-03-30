interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 md:py-24">
      <div>{children}</div>
    </main>
  );
}
