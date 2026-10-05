import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // サンプル集のフォルダ全体（library/docs/*.md などの読みものを読み込むのに使う）
      "@samples": fileURLToPath(new URL("..", import.meta.url)),
    },
  },
});
