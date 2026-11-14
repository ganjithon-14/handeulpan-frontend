import { WOOL_COLORS, type Pasture, type PasturePreview, type PastureSummary } from '@/api/types';

// 백엔드 docs/api 응답 예시를 그대로 옮긴 값 (pasture.md, bubble.md, scarf.md).

export const MOCK_PASTURE_ID = 'o76WTwo0Bc2ygE3Hpx9kkQ';

/** 이 id로 미리보기·합류하면 '가득 찬 들판'을 흉내 낸다 (합류 화면 확인용) */
export const MOCK_FULL_PASTURE_ID = 'mock-full';

/** 이 id는 내가 멤버가 아닌 들판이다. 토큰이 있어도 초대 랜딩이 보인다 */
export const MOCK_INVITE_PASTURE_ID = 'mock-invite';

export const MOCK_DEVICE_TOKEN = '3f1c7a0e-6c1b-4a8e-9a63-0c1f5d2b7e11';

export const mockPasture: Pasture = {
    pastureId: MOCK_PASTURE_ID,
    name: '대학 동기',
    maxSheep: 6,
    mySheepId: 1,
    sheep: [
        {
            id: 1,
            name: '두부',
            woolColor: 'CREAM',
            distance: 'CENTER',
            mine: true,
            pattedToday: true,
            bubble: null,
            wornScarf: 'MINT',
        },
        {
            id: 2,
            name: '콩이',
            woolColor: 'MINT',
            distance: 'EDGE',
            mine: false,
            bubble: { text: '오늘 입사 100일', flagged: false, createdAt: '2026-11-10T00:00:00Z' },
            wornScarf: null,
            sentScarfToday: true,
        },
    ],
    myScarves: [
        { id: 31, color: 'MINT' },
        { id: 27, color: 'CREAM' },
    ],
};

export const mockPastureSummaries: PastureSummary[] = [
    {
        pastureId: MOCK_PASTURE_ID,
        name: '대학 동기',
        mySheepId: 1,
        myDistance: 'CENTER',
        pattedToday: true,
        edgeFriendNames: ['콩이'],
    },
    // 두 번째 들판: 최근 들판으로 가기·들판 전환 확인용 (docs 예시에는 없는 값)
    {
        pastureId: 'mock-family',
        name: '우리 가족',
        mySheepId: 1,
        myDistance: 'WALK',
        pattedToday: false,
        edgeFriendNames: [],
    },
];

export function mockPreview(pastureId: string): PasturePreview {
    if (pastureId === MOCK_FULL_PASTURE_ID) {
        // 털 색 6종으로 6마리를 채운 가득 찬 들판
        return {
            pastureId,
            name: '꽉 찬 들판',
            maxSheep: 6,
            full: true,
            sheep: WOOL_COLORS.map((woolColor, index) => ({
                name: `양${index + 1}`,
                woolColor,
                distance: 'CENTER',
            })),
        };
    }
    return {
        pastureId,
        name: mockPasture.name,
        maxSheep: mockPasture.maxSheep,
        full: false,
        sheep: mockPasture.sheep.map(({ name, woolColor, distance }) => ({
            name,
            woolColor,
            distance,
        })),
    };
}
