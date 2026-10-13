import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: { outDir: "dist/client" },
  server: {
    host: "127.0.0.1",
    port: Number(process.env.DEV_PORT ?? 5173),
    strictPort: true,
    proxy: {
      "/api": `http://127.0.0.1:${process.env.API_PORT ?? 3000}`,
      "/health": `http://127.0.0.1:${process.env.API_PORT ?? 3000}`,
    },
  },
});
