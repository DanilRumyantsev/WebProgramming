import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from "@tailwindcss/vite";
import * as path from "node:path";

export default defineConfig({
    plugins: [
        react(),
        tailwindcss()
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        }
    },
    server: {
        port: 9000,
        proxy: {
            '/api': {
                target: 'http://localhost:5001', // ← бэкенд
                changeOrigin: true,
                secure: false,
                // 🔑 ОБЯЗАТЕЛЬНО:
                configure: (proxy, options) => {
                    // Включаем передачу кук
                    proxy.on('proxyReq', (proxyReq, req, res) => {
                        // Передаём куки от клиента → бэкенду
                        if (req.headers.cookie) {
                            proxyReq.setHeader('cookie', req.headers.cookie);
                        }
                    });
                    proxy.on('proxyRes', (proxyRes, req, res) => {
                        // Передаём Set-Cookie от бэкенда → клиенту
                        const setCookie = proxyRes.headers['set-cookie'];
                        if (setCookie) {
                            res.setHeader('set-cookie', setCookie);
                        }
                    });
                },
            },
        },
        host: true,
    }
});