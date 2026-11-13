import { apiClient } from '@/api/client';
import type {
    PatResponse,
    PutBubbleRequest,
    PutBubbleResponse,
    SendScarfResponse,
    WearScarfResponse,
} from '@/api/types';

// 말풍선·목도리도 경로가 /api/sheep/{sheepId}/... 라서 이 파일에 모았다.

/** 쓰다듬기. 내 양만 가능하고, 바로 가운데로 돌아온다. */
export async function patSheep(sheepId: number) {
    const { data } = await apiClient.post<PatResponse>(`/api/sheep/${sheepId}/pat`);
    return data;
}

/**
 * 말풍선 올리기 (내 양만).
 * 위험 키워드가 있으면 { posted: false, flagged: true }가 오고, 안내를 보여준 뒤
 * 사용자가 그대로 올리겠다고 하면 confirm: true로 다시 호출한다.
 */
export async function putBubble(sheepId: number, body: PutBubbleRequest) {
    const { data } = await apiClient.put<PutBubbleResponse>(`/api/sheep/${sheepId}/bubble`, body);
    return data;
}

/** 말풍선 지우기 (204) */
export async function deleteBubble(sheepId: number) {
    await apiClient.delete(`/api/sheep/${sheepId}/bubble`);
}

/** 목도리 보내기. sheepId는 받는 친구 양. 에러: ALREADY_SENT_TODAY, SELF */
export async function sendScarf(sheepId: number) {
    const { data } = await apiClient.post<SendScarfResponse>(`/api/sheep/${sheepId}/scarves`);
    return data;
}

/** 목도리 두르기·벗기. sheepId는 내 양, scarfId가 null이면 벗는다. */
export async function wearScarf(sheepId: number, scarfId: number | null) {
    const { data } = await apiClient.put<WearScarfResponse>(`/api/sheep/${sheepId}/scarf`, {
        scarfId,
    });
    return data;
}
