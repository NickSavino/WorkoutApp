import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

const isProduction = process.env.NODE_ENV === "production";
const target = isProduction
  ? "workoutappapi-e2bhced7b5a3h5dp.canadaeast-01.azurewebsites.net"
  : "https://localhost:7053";

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
            '^/api': {
                target,
                secure: isProduction,
                changeOrigin: true
            }
        },
        port: 61526,
        https: isProduction ? undefined : {
            key: fs.readFileSync(path.join(process.env.HOME || process.env.USERPROFILE || "", ".aspnet/https/workoutapp.client.key")),
            cert: fs.readFileSync(path.join(process.env.HOME || process.env.USERPROFILE || "", ".aspnet/https/workoutapp.client.pem")),
        }
    }
});
