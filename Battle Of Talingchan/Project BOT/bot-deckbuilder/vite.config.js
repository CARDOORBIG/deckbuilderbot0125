import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import os from 'os';

const networkInterfaces = os.networkInterfaces();
let localIp = 'localhost';
for (const name of Object.keys(networkInterfaces)) {
  for (const net of networkInterfaces[name]) {
    if (net.family === 'IPv4' && !net.internal) {
      localIp = net.address;
      break;
    }
  }
}

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',       // เปิดได้ทั้ง localhost และ IP จริง
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true,    // สำคัญมากสำหรับ Windows/WSL
      interval: 100,
    },
    hmr: {
      protocol: 'ws',
      host: 'localhost',   // ✅ บังคับให้ socket ผูกกับ localhost
      clientPort: 5173,
    },
  },
  preview: {
    port: 4173,
  },
  clearScreen: false,
});
