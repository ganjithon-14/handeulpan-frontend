import { fileURLToPath, URL } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const CREAM = '#fffdf8'; // --color-cream

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        // PWA: 홈 화면에 추가할 수 있게 manifest와 서비스워커를 만든다.
        // 서비스워커는 build 결과물에만 생긴다 (pnpm dev에서는 꺼져 있음).
        VitePWA({
            // 새 버전이 배포되면 묻지 않고 바로 바꾼다. 시연 중 옛 화면이 남지 않게 하려는 것.
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'logo.svg', 'apple-touch-icon-180x180.png'],
            manifest: {
                name: '한 들판',
                short_name: '한 들판',
                description: '멀리 있어도 한 들판에',
                lang: 'ko',
                start_url: '/',
                display: 'standalone',
                background_color: CREAM,
                theme_color: CREAM,
                // 아이콘은 `pnpm generate-pwa-assets`로 public/logo.svg에서 만든 파일
                icons: [
                    { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
                    { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
                    { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
                    {
                        src: 'maskable-icon-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable',
                    },
                ],
            },
            workbox: {
                // SPA라서 모르는 주소로 들어와도 index.html을 돌려준다 (/p/... 초대 링크).
                navigateFallback: '/index.html',
                // 미리 받아 둘 파일. 폰트(woff2)는 서브셋 조각이 수백 개(약 13MB)라 빼고,
                // 아래 runtimeCaching으로 실제로 쓴 조각만 캐시한다.
                // /api 응답은 캐시하지 않는다(runtimeCaching에 없음). 항상 서버의 최신 거리 값을 써야 한다.
                // 디자인 에셋은 WebP로 넣는다(PNG 원본은 2MB 넘어 캐시 한도를 넘음).
                globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
                runtimeCaching: [
                    {
                        urlPattern: ({ request }) => request.destination === 'font',
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'fonts',
                            expiration: { maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 365 },
                        },
                    },
                ],
            },
        }),
    ],
    // 로컬에서도 배포(vercel.json 리라이트)와 똑같이 /api를 백엔드로 넘긴다.
    server: {
        proxy: {
            '/api': { target: 'https://handeulpan.p-e.kr', changeOrigin: true },
        },
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
});
