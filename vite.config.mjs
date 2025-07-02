import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/css/app.css', 'resources/js/app.js', 'resources/js/app.jsx'],
      refresh: true,
    }),
    react(),
  ],
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: true,
  },
  esbuild: {
    loader: 'jsx',
    include: /resources\/js\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@inertiajs/react'],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
});
