import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    base: './', // Importante para GitHub Pages
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY || env.VITE_GEMINI_API_KEY || ''),
      'process.env.NODE_ENV': JSON.stringify(mode)
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      sourcemap: false,
      minify: 'esbuild'
    },
    server: {
      port: 3000,
      host: true
    }
  };
});