/// <reference types="vite/client" />

interface ImportMetaEnv {
    /** 목업 API 사용 여부 ('true' | 'false' | '') */
    readonly VITE_USE_MOCK?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
