import { Link, Navigate } from 'react-router';

import { useAuthStore } from '@/stores/authStore';

/** `/onboarding` "멀리 있어도 한 들판에" → 시작하기(가입) / 로그인 */
export function OnboardingPage() {
    const deviceToken = useAuthStore((state) => state.deviceToken);
    // 이미 로그인했으면 온보딩을 다시 보여줄 필요가 없다
    if (deviceToken) return <Navigate to="/" replace />;

    return (
        <main className="mx-auto flex min-h-dvh max-w-[393px] flex-col items-center bg-cream px-6 pt-32 pb-10">
            <img src="/logo.svg" alt="한 들판" className="w-40" />
            <p className="mt-8 font-batang text-xl text-primary">멀리 있어도 한 들판에</p>

            <Link
                to="/signup"
                className="mt-auto w-full rounded-xl bg-primary py-4 text-center font-bold text-white"
            >
                시작하기
            </Link>
            <p className="mt-4 text-sm text-primary/70">
                이미 계정이 있어요{' '}
                <Link to="/login" className="font-bold underline">
                    로그인
                </Link>
            </p>
        </main>
    );
}
