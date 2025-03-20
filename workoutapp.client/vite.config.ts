import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const isProduction = process.env.NODE_ENV === "production";

// https://vitejs.dev/config/
export default defineConfig({
    base: isProduction ? "/" : "/",
    plugins: [plugin(), tailwindcss()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    build: {
        outDir: "dist",
        sourcemap: false,
    },
    server: {
        proxy: {
          '/api': {
            target: 'https://workoutappapi-a9c4fpcqdtbzb5an.westus-01.azurewebsites.net',
            changeOrigin: true,
            secure: false,
          }
        }
      }
});
