import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    base: './', // Crucial para deploys em pastas ou subdomínios da Hostinger
    define: {
      'process.env': {
        API_KEY: JSON.stringify(env.API_KEY || env.VITE_GEMINI_API_KEY || ''),
        NODE_ENV: JSON.stringify(mode)
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'lucide-react']
          }
        }
      }
    }
  };
});