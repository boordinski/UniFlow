// @ts-check
// https://astro.build/config

import { defineConfig } from "astro/config";

export default defineConfig({
  vite: {
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:3000",
          changeOrigin: true
        }
      }
    }
  }
});
