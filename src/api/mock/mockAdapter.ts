import { AxiosError, type AxiosAdapter, type InternalAxiosRequestConfig } from 'axios';

import {
    MOCK_DEVICE_TOKEN,
    MOCK_FULL_PASTURE_ID,
    MOCK_PASTURE_ID,
    mockPasture,
    mockPastureSummaries,
    mockPreview,
} from '@/api/mock/data';

/**
 * 목업 모드(VITE_USE_MOCK=true)에서 실제 서버 대신 응답을 돌려주는 axios 어댑터.
 * MSW 대신 이 방식을 쓰는 이유: 패키지가 늘지 않고, PWA 서비스워커와 부딪칠 일이 없다.
 *
 * 상태를 저장하지 않는다. 같은 요청에는 항상 docs 예시와 같은 응답이 온다.
 * 에러 화면 확인용 장치:
 * - 토큰 없이 로그인이 필요한 API를 부르면 401 INVALID_DEVICE_TOKEN
 * - 들판 id가 'mock-full'이면 미리보기는 full, 합류는 409 PASTURE_FULL
 * - 내 양(id 1)에게 목도리를 보내면 400 SELF
 * - 말풍선에 '죽고싶'이 들어 있으면 위험 키워드로 처리
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
    handle: (params: string[], body: Record<string, unknown>) => MockResult;
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
        handle: () => ok({ deviceToken: MOCK_DEVICE_TOKEN }, 201),
    },
    {
        method: 'post',
        path: /^\/api\/auth\/login$/,
        auth: false,
        handle: () => ok({ deviceToken: MOCK_DEVICE_TOKEN }),
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
        handle: ([pastureId]) => ok({ ...mockPasture, pastureId }),
    },

    // 양
    {
        method: 'post',
        path: /^\/api\/sheep\/(\d+)\/pat$/,
        auth: true,
        handle: ([sheepId]) =>
            ok({ sheepId: Number(sheepId), distance: 'CENTER', pattedToday: true }),
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
        return route.handle(match.slice(1), parseBody(config.data));
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
