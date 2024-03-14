import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  base: "/",
  plugins: [vue()],
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(module) {
          if(/node_modules/.test(module)) {
            if(/modules\/vue/.test(module)) {
              return 'vue';
            }
            if(/modules\/monaco-editor/.test(module)) {
              return 'monaco-editor';
            }
            return 'vendor'
          }
          return 'main'
        }
      }
    }
  }
}));
