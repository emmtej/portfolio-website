import { Layout } from "./components/Layout";
import { Tabs } from "./components/Tabs";

function App() {
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
            Hello, I'm <br />
            <span className="opacity-30">Emmanuel</span>
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
