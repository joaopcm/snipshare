import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    cors: true,
    // headers: {
    //   "Cross-Origin-Embedder-Policy": "require-corp",
    //   "Cross-Origin-Opener-Policy": "same-origin",
    //   "Cross-Origin-Resource-Policy": "cross-origin",
    // },
  },
});
