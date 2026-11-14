import { createBrowserRouter } from 'react-router';

import { RequireAuth } from '@/features/auth/RequireAuth';
import { HomePage } from '@/pages/HomePage';
import { JoinPage } from '@/pages/JoinPage';
import { LoginPage } from '@/pages/LoginPage';
import { NewPasturePage } from '@/pages/NewPasturePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { OnboardingPage } from '@/pages/OnboardingPage';
import { PasturePage } from '@/pages/PasturePage';
import { SignupPage } from '@/pages/SignupPage';

/**
 * 라우트 표 (CLAUDE.md 7장).
 * 초대 링크 형식이 /p/{pastureId}라서 들판 주소도 같은 모양을 쓴다.
 */
export const router = createBrowserRouter([
    { path: '/', element: <HomePage /> },
    { path: '/onboarding', element: <OnboardingPage /> },
    { path: '/signup', element: <SignupPage /> },
    { path: '/login', element: <LoginPage /> },
    {
        path: '/new',
        element: (
            <RequireAuth>
                <NewPasturePage />
            </RequireAuth>
        ),
    },
    // 들판 주소는 토큰 없이도 연다: 멤버가 아니면 초대 미리보기(토큰 불필요)를 보여주기 때문
    { path: '/p/:pastureId', element: <PasturePage /> },
    {
        path: '/p/:pastureId/join',
        element: (
            <RequireAuth>
                <JoinPage />
            </RequireAuth>
        ),
    },
    { path: '*', element: <NotFoundPage /> },
]);
