import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    globals: false,
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, "src"),
      "@": path.resolve(__dirname, "src"),
    },
  },
});
