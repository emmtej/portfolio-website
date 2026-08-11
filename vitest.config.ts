import { defineConfig } from "vitest/config";

// https://vitest.dev/config/
export default defineConfig({
  server: { port: 3000 },
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
      include: ["src/**/*.{ts,tsx}"],
      thresholds: {
        lines: 60,
        functions: 60,
        branches: 50,
      },
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/test/**",
        "src/**/*.d.ts",
      ],
    },
  },
});
