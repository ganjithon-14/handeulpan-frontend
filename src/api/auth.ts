import { apiClient } from '@/api/client';
import type { AuthResponse, LoginRequest, SignupRequest } from '@/api/types';

/** 가입. 성공하면 바로 로그인 상태라 받은 토큰을 저장하면 된다. */
export async function signup(body: SignupRequest) {
    const { data } = await apiClient.post<AuthResponse>('/api/auth/signup', body);
    return data;
}

/** 로그인. 매번 새 토큰이 나오고 다른 기기의 이전 토큰은 무효가 된다. */
export async function login(body: LoginRequest) {
    const { data } = await apiClient.post<AuthResponse>('/api/auth/login', body);
    return data;
}

/** 로그아웃 (204). 저장된 토큰은 호출한 쪽에서 지운다. */
export async function logout() {
    await apiClient.post('/api/auth/logout');
}
