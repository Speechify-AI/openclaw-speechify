import { defineConfig } from "tsdown";

// Mirrors how OpenClaw builds its own externally published plugins: one ESM
// file per source module, host SDK imports left external, nothing minified.
export default defineConfig({
  entry: {
    index: "./index.ts",
    "capability-catalog": "./capability-catalog.ts",
  },
  format: "esm",
  platform: "node",
  target: "node24",
  outDir: "dist",
  clean: true,
  unbundle: true,
  dts: false,
  // Emit .js, which is what runtimeExtensions points at.
  fixedExtension: false,
  sourcemap: false,
  external: [/^openclaw(\/|$)/, /^node:/],
});
