import { defineConfig } from "vite";

export default defineConfig({
  root: "FRONTEND",
  server: {
    open: true,
    port: 5173,
  },
  preview: {
    port: 4173,
  },
});
