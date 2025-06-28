import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "/", // root-relative paths
  build: {
    outDir: "dist", // default is fine for static site
    emptyOutDir: true,
  },
});

