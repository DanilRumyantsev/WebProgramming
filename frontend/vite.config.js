import {defineConfig} from 'vite';
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
                configure: (proxy, options) => {
                    proxy.on('proxyReq', (proxyReq, req, res) => {
                        if (req.headers.cookie) {
                            proxyReq.setHeader('cookie', req.headers.cookie);
                        }
                    });
                    proxy.on('proxyRes', (proxyRes, req, res) => {
                        const setCookie = proxyRes.headers['set-cookie'];
                        if (setCookie) {
                            res.setHeader('set-cookie', setCookie);
                        }
                    });
                },
            },
            '/uploads': {
                target: 'http://localhost:9002',
                changeOrigin: true,
                rewrite: (path) => path,
            },
        },
        host: true,
    }
});