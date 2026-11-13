import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config';

// PWA 아이콘 생성 설정. 원본은 Figma Design System의 Logo(public/logo.svg)이다.
// 로고가 바뀌면 `pnpm generate-pwa-assets`로 public/ 아래 아이콘을 다시 만든다.
const BACKGROUND = '#fffdf8'; // 크림 배경 (--color-cream)

export default defineConfig({
    headLinkOptions: { preset: '2023' },
    preset: {
        ...minimal2023Preset,
        // 마스커블·애플 아이콘은 투명 배경이 허용되지 않아 크림색으로 채운다.
        maskable: { ...minimal2023Preset.maskable, resizeOptions: { background: BACKGROUND } },
        apple: { ...minimal2023Preset.apple, resizeOptions: { background: BACKGROUND } },
    },
    images: ['public/logo.svg'],
});
