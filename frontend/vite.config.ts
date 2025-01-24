import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        start_url: '/main',
        name: 'Листай-Знай',
        short_name: 'Листай-знай',
        description: 'Учи легко всё',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'icons8-leaf-96.png',
            sizes: '96x96',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})