import { Layout } from "./components/Layout";
import { Tabs } from "./components/Tabs";

function App() {
  return (
    <Layout>
      <div className="space-y-10">
        <header className="space-y-4">
          <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.3em] text-text-muted">
            <a
              href="https://github.com/emmtej"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text-main transition-colors duration-200"
            >
              [GH].EMMTEJ
            </a>
            <span className="opacity-60 text-xs font-sans">//</span>
            <a
              href="mailto:contact@emmanueltejeda.com"
              className="hover:text-text-main transition-colors duration-200"
            >
              [EMAIL].CONTACT
            </a>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-text-main">
            Hello, I'm <span>Emmanuel</span>
          </h1>
        </header>
        <Tabs />
      </div>
    </Layout>
  );
}

export default App;
