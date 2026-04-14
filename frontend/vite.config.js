import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  plugins: [
    react(),
    basicSsl() // Thêm plugin này để tạo HTTPS
  ],
  server: {
    host: true, // Cho phép truy cập bằng IP LAN (VD: 192.168.x.x)
    port: 5173,
  }
})