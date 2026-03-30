import { Layout } from "./components/Layout";
import { Tabs } from "./components/Tabs";

function App() {
  return (
    <Layout>
      <div className="space-y-10">
        <header>
          <h1 className="text-4xl font-bold tracking-tight text-[#37352f]">
            Hello, I'm Emmanuel
          </h1>
        </header>
        <Tabs />
      </div>
    </Layout>
  );
}

export default App;
