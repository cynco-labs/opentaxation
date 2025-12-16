import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Manual registration - we'll register only on mobile
      injectRegister: false,
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'OpenTaxation Malaysia',
        short_name: 'OpenTax',
        description: 'Compare Enterprise vs Sdn Bhd tax scenarios for Malaysian businesses',
        theme_color: '#2a2825',
        background_color: '#f7f4ef',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
      },
      // Disable PWA in development - prevents caching dev assets
      devOptions: {
        enabled: false,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@tax-engine/core': path.resolve(__dirname, '../../packages/core'),
      '@tax-engine/config': path.resolve(__dirname, '../../packages/config'),
    },
  },
  server: {
    port: 3001,
  },
  build: {
    sourcemap: process.env.NODE_ENV !== 'production',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'charts': ['recharts'],
          'pdf': ['@react-pdf/renderer'],
          'motion': ['framer-motion'],
          'editor': [
            '@tiptap/react',
            '@tiptap/starter-kit',
            '@tiptap/extension-code-block-lowlight',
            '@tiptap/extension-heading',
            '@tiptap/extension-image',
            '@tiptap/extension-link',
            '@tiptap/extension-placeholder',
            '@tiptap/extension-text-align',
            '@tiptap/extension-underline',
            'lowlight',
          ],
        },
      },
    },
  },
});

