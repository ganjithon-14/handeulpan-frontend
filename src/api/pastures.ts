import { apiClient } from '@/api/client';
import type {
    CreatePastureRequest,
    JoinPastureRequest,
    Pasture,
    PasturePreview,
    PastureSummary,
    SheepCreatedResponse,
} from '@/api/types';

/** 내 들판 목록 (최근 합류 순) */
export async function getMyPastures() {
    const { data } = await apiClient.get<PastureSummary[]>('/api/pastures');
    return data;
}

/** 들판 만들기 (내 양도 같이 만들어진다) */
export async function createPasture(body: CreatePastureRequest) {
    const { data } = await apiClient.post<SheepCreatedResponse>('/api/pastures', body);
    return data;
}

/** 초대 미리보기. 토큰 없이 호출할 수 있다. */
export async function getPasturePreview(pastureId: string) {
    const { data } = await apiClient.get<PasturePreview>(`/api/pastures/${pastureId}/preview`);
    return data;
}

/** 합류 (내 양 풀어놓기). 에러: PASTURE_FULL, ALREADY_JOINED */
export async function joinPasture(pastureId: string, body: JoinPastureRequest) {
    const { data } = await apiClient.post<SheepCreatedResponse>(
        `/api/pastures/${pastureId}/sheep`,
        body,
    );
    return data;
}

/** 들판 조회. 이 응답 하나로 들판 화면을 그린다. 멤버가 아니면 NOT_PASTURE_MEMBER */
export async function getPasture(pastureId: string) {
    const { data } = await apiClient.get<Pasture>(`/api/pastures/${pastureId}`);
    return data;
}
