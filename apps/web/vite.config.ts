import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@cognivanta/core': path.resolve(__dirname, '../../packages/core/src'),
      '@cognivanta/db': path.resolve(__dirname, '../../packages/db/src'),
      '@cognivanta/model-gateway': path.resolve(__dirname, '../../packages/model-gateway/src'),
      '@cognivanta/rag-engine': path.resolve(__dirname, '../../packages/rag-engine/src'),
      '@cognivanta/vector-store': path.resolve(__dirname, '../../packages/vector-store/src'),
      '@cognivanta/agent-engine': path.resolve(__dirname, '../../packages/agent-engine/src'),
      '@cognivanta/workflow-engine': path.resolve(__dirname, '../../packages/workflow-engine/src'),
      '@cognivanta/analytics-metering': path.resolve(__dirname, '../../packages/analytics-metering/src'),
      '@cognivanta/eval-engine': path.resolve(__dirname, '../../packages/eval-engine/src'),
      '@cognivanta/audit-compliance': path.resolve(__dirname, '../../packages/audit-compliance/src'),
      '@cognivanta/sdk': path.resolve(__dirname, '../../packages/sdk/src')
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/ws': {
        target: 'ws://localhost:3000',
        ws: true
      }
    }
  }
});
