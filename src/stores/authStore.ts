import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    /** 가입·로그인으로 받은 토큰. 없으면 로그인 전 */
    deviceToken: string | null;
    setToken: (deviceToken: string) => void;
    clearToken: () => void;
}

/**
 * 기기 토큰 스토어.
 * persist로 localStorage에 저장해서 새로고침하거나 앱을 다시 열어도 로그인이 유지된다.
 * React 밖(axios 인터셉터)에서는 useAuthStore.getState()로 읽는다.
 */
export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            deviceToken: null,
            setToken: (deviceToken) => set({ deviceToken }),
            clearToken: () => set({ deviceToken: null }),
        }),
        { name: 'handeulpan-auth' },
    ),
);
