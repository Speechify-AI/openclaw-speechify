import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.test.ts"],
    exclude: process.env.OPENCLAW_LIVE_TEST ? [] : ["**/*.live.test.ts"],
    environment: "node",
  },
});
