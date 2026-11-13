import axios from 'axios';

import { ERROR_CODE, toApiError } from '@/api/errors';
import { mockAdapter } from '@/api/mock/mockAdapter';
import { useAuthStore } from '@/stores/authStore';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

/**
 * 모든 API 요청이 거치는 axios 인스턴스.
 * - baseURL이 없다: 같은 주소의 /api/...를 부르면 Vercel 리라이트(배포)와 Vite 프록시(로컬)가
 *   백엔드로 넘긴다. 브라우저 입장에선 같은 출처라 CORS 허용이 필요 없다.
 * - 인증은 쿠키가 아니라 헤더라서 withCredentials를 켜지 않는다.
 * - 목업 모드면 실제 서버 대신 mockAdapter가 docs 예시 응답을 돌려준다.
 */
export const apiClient = axios.create({
    timeout: 10_000,
    ...(USE_MOCK && { adapter: mockAdapter }),
});

// 요청마다 저장된 토큰을 X-Device-Token 헤더에 붙인다.
// 미리보기처럼 토큰이 필요 없는 API에 붙어 가도 서버는 무시한다.
apiClient.interceptors.request.use((config) => {
    const { deviceToken } = useAuthStore.getState();
    if (deviceToken) {
        config.headers.set('X-Device-Token', deviceToken);
    }
    return config;
});

// 실패는 전부 ApiError로 바꿔서 던진다. 화면에서는 error.code로 분기한다.
apiClient.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
        const apiError = toApiError(error);

        // 토큰이 없거나 무효(다른 기기에서 로그인 등): 토큰을 지우고 로그인 화면으로.
        // 인터셉터는 React 밖이라 라우터 훅을 못 쓰므로 주소를 직접 바꾼다.
        if (apiError.code === ERROR_CODE.INVALID_DEVICE_TOKEN) {
            useAuthStore.getState().clearToken();
            if (window.location.pathname !== '/login') {
                window.location.replace('/login');
            }
        }

        return Promise.reject(apiError);
    },
);
