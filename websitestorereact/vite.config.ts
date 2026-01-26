import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import mkcert from 'vite-plugin-mkcert'; 

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Check if we are in "lan" mode
  const isLan = mode === 'lan';

  return {
    build: {
      outDir: '../WebApiStore/wwwroot',
      chunkSizeWarningLimit: 1024,
      emptyOutDir: true,
    },
    server: {
      port: 3000,
      host: true // Always allow network access
    },
    plugins: [
      react(),
      // Only add mkcert (HTTPS) if we are NOT in LAN mode
      !isLan ? mkcert() : undefined
    ],
  }
})
