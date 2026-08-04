import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitest.dev/config/
export default defineConfig({
  server: { port: 3000 },
  plugins: [
    react({
      babel: {
        plugins: [
          ["babel-plugin-react-compiler", { target: "19" }],
        ],
      },
    }),
    tailwindcss(),
  ],
  test: {
    environment: "jsdom",
    globals: false,
    setupFiles: ["./src/test/setup-storage.ts", "./src/test/setup.ts"],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.worktrees/**",
      "**/cypress/**",
      "**/.{idea,git,cache,output,temp}/**",
      "tests/**",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      thresholds: {
        lines: 60,
        functions: 60,
        branches: 50,
      },
      exclude: ["**/node_modules/**", "**/dist/**", "src/test/**", "**/*.d.ts", "astro.config.mjs", "vitest.config.ts", "eslint.config.js"],
    },
  },
});
