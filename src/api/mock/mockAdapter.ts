import { AxiosError, type AxiosAdapter, type InternalAxiosRequestConfig } from 'axios';

import {
    MOCK_DEVICE_TOKEN,
    MOCK_FULL_PASTURE_ID,
    MOCK_INVITE_PASTURE_ID,
    MOCK_PASTURE_ID,
    mockPasture,
    mockPastureSummaries,
    mockPreview,
} from '@/api/mock/data';
import type { Distance } from '@/api/types';

// 가입·로그인 에러 화면 확인용 값
const MOCK_DUPLICATE_EMAIL = 'dup@test.com';
const MOCK_WRONG_PASSWORD = 'wrong1234';

/** 목업 전용 데모 키. 실서버 키와 상관없는 값이라 코드에 둬도 된다 */
const MOCK_DEMO_KEY = 'mock-demo';

/**
 * 양별 '마지막으로 쓰다듬은 지 며칠'. 데모 되감기를 누적해서 보여주려고 이것만 상태로 둔다.
 * 처음 값은 docs 예시의 거리에 맞춘다. 새로고침하면 처음으로 돌아간다.
 */
const BASE_DAYS = { CENTER: 0, WALK: 2, EDGE: 4 } as const;
const daysSincePat = new Map<number, number>(
    mockPasture.sheep.map(({ id, distance }) => [id, BASE_DAYS[distance]]),
);

/** sheep.md 거리 기준: 2일 미만 CENTER, 4일 미만 WALK, 그 이상 EDGE */
function mockDistance(sheepId: number): Distance {
    const days = daysSincePat.get(sheepId) ?? 0;
    if (days >= 4) return 'EDGE';
    if (days >= 2) return 'WALK';
    return 'CENTER';
}

/**
 * 목업 모드(VITE_USE_MOCK=true)에서 실제 서버 대신 응답을 돌려주는 axios 어댑터.
 * MSW 대신 이 방식을 쓰는 이유: 패키지가 늘지 않고, PWA 서비스워커와 부딪칠 일이 없다.
 *
 * 데모 되감기로 바뀐 거리 말고는 상태를 저장하지 않는다. 같은 요청에는 docs 예시와 같은 응답이 온다.
 * 에러 화면 확인용 장치:
 * - 토큰 없이 로그인이 필요한 API를 부르면 401 INVALID_DEVICE_TOKEN
 * - 가입 이메일이 dup@test.com이면 409 DUPLICATE_EMAIL, 로그인 비밀번호가 wrong1234면 401 INVALID_CREDENTIALS
 * - 들판 id가 'mock-full'이면 미리보기는 full, 합류는 409 PASTURE_FULL
 * - 들판 id가 'mock-invite'·'mock-full'이면 들판 조회는 403 NOT_PASTURE_MEMBER (초대 랜딩 확인용)
 * - 내 양(id 1)에게 목도리를 보내면 400 SELF
 * - 말풍선에 '죽고싶'이 들어 있으면 위험 키워드로 처리
 * - 데모 되감기는 X-Demo-Key가 'mock-demo'일 때만 통과, 아니면 403 INVALID_DEMO_KEY
 */

interface MockResult {
    status: number;
    data?: unknown;
}

interface MockRoute {
    method: string;
    /** 경로 패턴. 괄호로 묶은 부분이 params로 넘어간다 */
    path: RegExp;
    /** 토큰이 필요한 API인지 */
    auth: boolean;
    handle: (
        params: string[],
        body: Record<string, unknown>,
        config: InternalAxiosRequestConfig,
    ) => MockResult;
}

const ok = (data?: unknown, status = 200): MockResult => ({ status, data });
const fail = (status: number, code: string, message: string): MockResult => ({
    status,
    data: { code, message },
});

const routes: MockRoute[] = [
    // 인증
    {
        method: 'post',
        path: /^\/api\/auth\/signup$/,
        auth: false,
        handle: (_params, body) =>
            body.email === MOCK_DUPLICATE_EMAIL
                ? fail(409, 'DUPLICATE_EMAIL', '이미 가입된 이메일입니다.')
                : ok({ deviceToken: MOCK_DEVICE_TOKEN }, 201),
    },
    {
        method: 'post',
        path: /^\/api\/auth\/login$/,
        auth: false,
        handle: (_params, body) =>
            body.password === MOCK_WRONG_PASSWORD
                ? fail(401, 'INVALID_CREDENTIALS', '이메일 또는 비밀번호가 올바르지 않습니다.')
                : ok({ deviceToken: MOCK_DEVICE_TOKEN }),
    },
    { method: 'post', path: /^\/api\/auth\/logout$/, auth: true, handle: () => ok(undefined, 204) },

    // 들판
    {
        method: 'get',
        path: /^\/api\/pastures$/,
        auth: true,
        handle: () => ok(mockPastureSummaries),
    },
    {
        method: 'post',
        path: /^\/api\/pastures$/,
        auth: true,
        handle: () => ok({ pastureId: MOCK_PASTURE_ID, sheepId: 1 }, 201),
    },
    {
        method: 'get',
        path: /^\/api\/pastures\/([^/]+)\/preview$/,
        auth: false,
        handle: ([pastureId]) => ok(mockPreview(pastureId)),
    },
    {
        method: 'post',
        path: /^\/api\/pastures\/([^/]+)\/sheep$/,
        auth: true,
        handle: ([pastureId]) =>
            pastureId === MOCK_FULL_PASTURE_ID
                ? fail(409, 'PASTURE_FULL', '이 들판은 가득 찼어요.')
                : ok({ pastureId, sheepId: 2 }, 201),
    },
    {
        method: 'get',
        path: /^\/api\/pastures\/([^/]+)$/,
        auth: true,
        handle: ([pastureId]) =>
            pastureId === MOCK_INVITE_PASTURE_ID || pastureId === MOCK_FULL_PASTURE_ID
                ? fail(403, 'NOT_PASTURE_MEMBER', '이 들판의 멤버가 아니에요.')
                : ok({
                      ...mockPasture,
                      pastureId,
                      sheep: mockPasture.sheep.map((sheep) => ({
                          ...sheep,
                          distance: mockDistance(sheep.id),
                      })),
                  }),
    },

    // 양
    {
        method: 'post',
        path: /^\/api\/sheep\/(\d+)\/pat$/,
        auth: true,
        handle: ([sheepId]) => {
            // 서버처럼 쓰다듬으면 되감은 것도 지워지고 가운데로 돌아온다
            daysSincePat.set(Number(sheepId), 0);
            return ok({ sheepId: Number(sheepId), distance: 'CENTER', pattedToday: true });
        },
    },
    {
        method: 'put',
        path: /^\/api\/sheep\/(\d+)\/bubble$/,
        auth: true,
        handle: (_params, body) => {
            const text = String(body.text ?? '');
            const risky = text.replace(/\s/g, '').includes('죽고싶');
            if (risky && body.confirm !== true) return ok({ posted: false, flagged: true });
            return ok({ posted: true, flagged: risky });
        },
    },
    {
        method: 'delete',
        path: /^\/api\/sheep\/(\d+)\/bubble$/,
        auth: true,
        handle: () => ok(undefined, 204),
    },
    {
        method: 'post',
        path: /^\/api\/sheep\/(\d+)\/scarves$/,
        auth: true,
        handle: ([sheepId]) =>
            Number(sheepId) === mockPasture.mySheepId
                ? fail(400, 'SELF', '내 양에게는 목도리를 보낼 수 없어요.')
                : ok({ color: 'CREAM' }, 201),
    },
    {
        method: 'put',
        path: /^\/api\/sheep\/(\d+)\/scarf$/,
        auth: true,
        handle: (_params, body) => {
            if (body.scarfId === null) return ok({ wornScarf: null });
            const scarf = mockPasture.myScarves.find(({ id }) => id === body.scarfId);
            return scarf
                ? ok({ wornScarf: scarf.color })
                : fail(404, 'SCARF_NOT_FOUND', '받은 목도리가 아니에요.');
        },
    },

    // 데모 (토큰 대신 X-Demo-Key)
    {
        method: 'post',
        path: /^\/api\/demo\/sheep\/(\d+)\/rewind$/,
        auth: false,
        handle: ([sheepId], body, config) => {
            const id = Number(sheepId);
            const days = Number(body.days);
            if (config.headers.get('X-Demo-Key') !== MOCK_DEMO_KEY) {
                return fail(403, 'INVALID_DEMO_KEY', '데모 키가 올바르지 않아요.');
            }
            if (!daysSincePat.has(id)) return fail(404, 'SHEEP_NOT_FOUND', '없는 양이에요.');
            if (!Number.isInteger(days) || days < 1 || days > 30) {
                return fail(400, 'VALIDATION_FAILED', 'days는 1~30이어야 해요.');
            }
            // 서버 Sheep.rewind()처럼 지금 기준이 아니라 지난 쓰다듬기에서 더 민다 (누적)
            daysSincePat.set(id, (daysSincePat.get(id) ?? 0) + days);
            return ok({ sheepId: id, distance: mockDistance(id) });
        },
    },
];

/** 실제 네트워크처럼 보이게 하는 지연 (로딩 화면 확인용) */
const MOCK_DELAY_MS = 300;

function parseBody(data: unknown): Record<string, unknown> {
    // axios가 어댑터에 넘기기 전에 본문을 JSON 문자열로 바꿔 둔다
    if (typeof data !== 'string' || data === '') return {};
    try {
        return JSON.parse(data) as Record<string, unknown>;
    } catch {
        return {};
    }
}

function resolve(config: InternalAxiosRequestConfig): MockResult {
    const method = (config.method ?? 'get').toLowerCase();
    const path = config.url ?? '';

    for (const route of routes) {
        if (route.method !== method) continue;
        const match = route.path.exec(path);
        if (!match) continue;

        if (route.auth && !config.headers.get('X-Device-Token')) {
            return fail(401, 'INVALID_DEVICE_TOKEN', '로그인이 필요해요.');
        }
        return route.handle(match.slice(1), parseBody(config.data), config);
    }

    return fail(404, 'NOT_FOUND', `목업에 없는 요청이에요: ${method.toUpperCase()} ${path}`);
}

export const mockAdapter: AxiosAdapter = async (config) => {
    await new Promise((done) => setTimeout(done, MOCK_DELAY_MS));

    const { status, data } = resolve(config);
    const response = { data, status, statusText: '', headers: {}, config, request: null };

    if (status >= 400) {
        throw new AxiosError(`Mock ${status}`, AxiosError.ERR_BAD_REQUEST, config, null, response);
    }
    return response;
};
