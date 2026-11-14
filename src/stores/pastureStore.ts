import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PastureState {
    /** 마지막으로 연 들판. `/` 첫 진입 때 이 들판으로 보낸다 */
    lastPastureId: string | null;
    setLastPastureId: (pastureId: string) => void;
}

/**
 * 서버 들판 목록은 '최근 합류 순'이고 접속 시각이 없어서,
 * Figma 규칙("가장 최근에 접속한 들판")을 맞추려고 기기에 따로 기억한다.
 */
export const usePastureStore = create<PastureState>()(
    persist(
        (set) => ({
            lastPastureId: null,
            setLastPastureId: (lastPastureId) => set({ lastPastureId }),
        }),
        { name: 'handeulpan-pasture' },
    ),
);
