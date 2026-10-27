import { defineConfig } from "vite";

const pages = process.env.GITHUB_ACTIONS === "true";

export default defineConfig({
  base: pages ? "/stagecraft-studio/" : "/",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
