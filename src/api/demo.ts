import { apiClient } from '@/api/client';
import type { RewindResponse } from '@/api/types';

/**
 * 데모 되감기: 그 양의 마지막 쓰다듬은 시각을 days일 더 과거로 민다.
 * 서버 Sheep.rewind()가 `lastPattedAt.minus(days)`라서 누를수록 쌓인다 (1일 두 번 = 2일).
 * 기기 토큰 대신 X-Demo-Key로 인증한다. 토큰이 같이 붙어 가도 서버는 무시한다.
 * 에러: INVALID_DEMO_KEY(403), SHEEP_NOT_FOUND, VALIDATION_FAILED(days 1~30 밖)
 */
export async function rewindSheep(sheepId: number, days: number, demoKey: string) {
    const { data } = await apiClient.post<RewindResponse>(
        `/api/demo/sheep/${sheepId}/rewind`,
        { days },
        { headers: { 'X-Demo-Key': demoKey } },
    );
    return data;
}
