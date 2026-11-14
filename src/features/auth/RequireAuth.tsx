import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';

import { nextQuery } from '@/features/auth/next';
import { useAuthStore } from '@/stores/authStore';

/**
 * 토큰이 있어야 하는 화면을 감싼다. 없으면 가입 화면으로 보내고, 끝나면 원래 경로로 돌아온다.
 * 로그인이 아니라 가입으로 보내는 이유: 초대 링크로 오는 사람은 대부분 처음 온 사람이다.
 * 계정이 있으면 가입 화면의 로그인 링크로 넘어가면 된다.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
    const deviceToken = useAuthStore((state) => state.deviceToken);
    const { pathname, search } = useLocation();

    if (!deviceToken) {
        return <Navigate to={`/signup${nextQuery(pathname, search)}`} replace />;
    }
    return children;
}
