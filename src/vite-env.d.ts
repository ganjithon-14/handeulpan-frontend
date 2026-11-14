/// <reference types="vite/client" />

interface ImportMetaEnv {
    /** 백엔드 API 서버 주소 */
    readonly VITE_API_URL: string;
    /** 목업 API 사용 여부 ('true' | 'false' | '') */
    readonly VITE_USE_MOCK?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
