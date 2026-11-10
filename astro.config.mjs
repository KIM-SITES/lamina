import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  devToolbar: { enabled: false },
  vite: {
    build: { sourcemap: false },
    server: {
      watch: {
        ignored: ['**/.cache/**', '**/docs/evidencias/**', '**/playwright-report/**', '**/test-results/**', '**/dist/**'],
      },
    },
  },
});
