import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
// Import process to ensure TypeScript recognizes process.cwd() in the Vite configuration environment
import process from 'process';

export default defineConfig(({ mode }) => {
  // Load environment variables from the current working directory
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    base: './', 
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY || env.VITE_GEMINI_API_KEY || ''),
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process': { env: {} }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      sourcemap: false,
      minify: 'esbuild'
    }
  };
});
