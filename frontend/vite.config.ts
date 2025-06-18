import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/',  // ✅ Django will serve this from /static/
  build: {
    outDir: path.resolve(__dirname, 'static'), // ✅ absolute path is safer
    assetsDir: 'assets',
    emptyOutDir: true,
  },
});
