import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0', // Tüm ağ arayüzlerinden erişime izin ver
    proxy: {
      '/api': 'http://localhost:4000'
    }
  }
});


