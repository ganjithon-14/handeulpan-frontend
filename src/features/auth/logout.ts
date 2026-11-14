import { logout } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';

/**
 * 로그아웃: 서버 토큰 무효화 → 저장된 토큰 삭제 → 로그인 화면.
 * 서버 호출이 실패해도(이미 무효, 네트워크) 이 기기에서는 로그아웃시킨다.
 * 버튼은 나의 들판 시트(계획 7번)에서 붙인다.
 */
export async function logoutAndLeave() {
    await logout().catch(() => undefined);
    useAuthStore.getState().clearToken();
    window.location.replace('/login');
}
