import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  // Add this base property
  base: '/', 
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 5173,
    // Add strictPort to ensure it doesn't switch if 5173 is busy
    strictPort: true, 
    watch: {
      usePolling: true,
    },
  },
  build: {
    // Ensure output goes to 'dist' (standard for Nginx copy)
    outDir: 'dist',
    emptyOutDir: true,
  }
})