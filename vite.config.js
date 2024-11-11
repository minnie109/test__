import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  server: {
    host: '0.0.0.0', // 允许外部访问
    proxy: {
      '/api/conversation/process': {
        target: 'http://163.22.17.116:8123', // Home Assistant API 的根地址
        changeOrigin: true, // 更改请求头的来源，避免 CORS 问题
        rewrite: (path) => path.replace(/^\/api\/conversation\/process/, '/api/conversation/process') // 保持原始路徑
      }
    }
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => ['dotlottie-player', 'md-linedivider'].includes(tag), // 处理自定义元素
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
