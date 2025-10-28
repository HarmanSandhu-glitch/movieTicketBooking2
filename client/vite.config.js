/* eslint-env node */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'
  const isAnalyze = mode === 'analyze'

  return {
    plugins: [
      react(),

      // Bundle analyzer (only in analyze mode)
      isAnalyze && visualizer({
        filename: 'bundle-analysis.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
    ].filter(Boolean),

    // Build optimizations
    build: {
      target: 'es2015',
      minify: isProduction ? 'esbuild' : false,
      sourcemap: !isProduction,

      // Code splitting
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunks
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
            'ui-vendor': ['react-icons', 'react-toastify'],
          },
          // Improved chunk naming
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId
              ? chunkInfo.facadeModuleId.split('/').pop().replace('.js', '')
              : 'chunk'
            return `js/${facadeModuleId}-[hash].js`
          },
        },
      },

      // Bundle size limits
      chunkSizeWarningLimit: 1000,
    },

    // Server configuration
    server: {
      port: 5173,
      host: true,
      open: true,
      cors: true,
    },

    // Preview configuration (for production build testing)
    preview: {
      port: 4173,
      host: true,
    },

    // Environment variables
    define: {
      // eslint-disable-next-line no-undef
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
    },

    // CSS optimizations
    css: {
      devSourcemap: !isProduction,
    },

    // Resolve aliases for cleaner imports
    resolve: {
      alias: {
        '@': '/src',
        '@components': '/src/components',
        '@pages': '/src/pages',
        '@store': '/src/store',
        '@api': '/src/api',
        '@utils': '/src/utils',
      },
    },
  }
})
