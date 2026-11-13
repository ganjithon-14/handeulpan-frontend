// 백엔드 docs/api 기준 요청·응답 타입 (회원 전용 PR #20 반영).
// 필드가 바뀌면 백엔드 문서를 먼저 확인하고 여기를 고친다.

export const WOOL_COLORS = ['CREAM', 'PINK', 'YELLOW', 'MINT', 'SKY', 'LAVENDER'] as const;
export type WoolColor = (typeof WOOL_COLORS)[number];

/** 양의 거리. 서버가 마지막 쓰다듬은 시각으로 계산한 값을 그대로 쓴다. */
export type Distance = 'CENTER' | 'WALK' | 'EDGE';

// ── 인증 (auth.md) ──

export interface SignupRequest {
    nickname: string;
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    deviceToken: string;
}

// ── 들판 (pasture.md) ──

export interface CreatePastureRequest {
    /** 0~20자, 생략 가능 */
    name: string | null;
    /** 1~10자 */
    sheepName: string;
    woolColor: WoolColor;
    /** "멀어지면 들판 친구들이 알 수 있어요" 동의. true여야 한다 */
    agreed: boolean;
}

export interface JoinPastureRequest {
    sheepName: string;
    woolColor: WoolColor;
    agreed: boolean;
}

/** 들판 만들기·합류 응답 */
export interface SheepCreatedResponse {
    pastureId: string;
    sheepId: number;
}

/** 초대 미리보기 (토큰 불필요, 양 id 없음) */
export interface PasturePreview {
    pastureId: string;
    name: string | null;
    maxSheep: number;
    full: boolean;
    sheep: {
        name: string;
        woolColor: WoolColor;
        distance: Distance;
    }[];
}

/** 말풍선 (bubble.md). 24시간이 지나면 null로 내려온다 */
export interface Bubble {
    text: string;
    /** 위험 키워드가 있었는데 그대로 올린 글 */
    flagged: boolean;
    createdAt: string;
}

/** 내가 받은 목도리 (scarf.md). 같은 색은 최근 것 하나만 온다 */
export interface Scarf {
    id: number;
    color: WoolColor;
}

export interface PastureSheep {
    id: number;
    name: string;
    woolColor: WoolColor;
    distance: Distance;
    mine: boolean;
    /** 내 양에만 있다. 오늘 쓰다듬었는지 */
    pattedToday?: boolean;
    bubble: Bubble | null;
    /** 지금 두른 목도리 색. 안 둘렀으면 null */
    wornScarf: WoolColor | null;
    /** 내 양이 아닌 양에만 있다. 오늘 내가 이 친구에게 목도리를 보냈는지 */
    sentScarfToday?: boolean;
}

/** 들판 조회 (화면 전체) */
export interface Pasture {
    pastureId: string;
    name: string | null;
    maxSheep: number;
    mySheepId: number;
    /** 합류한 순서, 내 양 포함 */
    sheep: PastureSheep[];
    /** 최근 것이 먼저, 없으면 [] */
    myScarves: Scarf[];
}

/** 내 들판 목록 항목 (최근 합류 순) */
export interface PastureSummary {
    pastureId: string;
    name: string | null;
    mySheepId: number;
    myDistance: Distance;
    pattedToday: boolean;
    /** 가장자리에 간 친구 양 이름 (멀어짐 배너용) */
    edgeFriendNames: string[];
}

// ── 양 (sheep.md, bubble.md, scarf.md) ──

export interface PatResponse {
    sheepId: number;
    distance: Distance;
    pattedToday: boolean;
}

export interface PutBubbleRequest {
    /** 1~20자 */
    text: string;
    /** 위험 안내를 보고도 그대로 올리겠다는 뜻. 생략하면 false */
    confirm?: boolean;
}

export interface PutBubbleResponse {
    posted: boolean;
    flagged: boolean;
}

export interface SendScarfResponse {
    /** 보낸 목도리 색 (= 내 양의 털 색) */
    color: WoolColor;
}

export interface WearScarfResponse {
    wornScarf: WoolColor | null;
}
