import { defineConfig } from "vite";

export default defineConfig({
  // Makes sure /models/chaise.glb is served from the public folder
  publicDir: "public",
  server: {
    port: 5173,
  },
  build: {
    outDir: "dist",
  },
});
