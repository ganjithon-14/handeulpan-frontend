import { Link, Navigate } from 'react-router';

import { useAuthStore } from '@/stores/authStore';

/**
 * `/onboarding` 첫 화면 (Figma '홈 랜딩' 103:3695).
 * Figma는 393×852 고정 좌표지만, 키가 다른 폰에서도 버튼이 밀려나지 않게 세로 배치로 옮겼다.
 * 문구는 위, 양은 남는 공간 가운데, 버튼은 아래.
 */
export function OnboardingPage() {
    const deviceToken = useAuthStore((state) => state.deviceToken);
    // 이미 로그인했으면 온보딩을 다시 보여줄 필요가 없다
    if (deviceToken) return <Navigate to="/" replace />;

    return (
        <main className="relative mx-auto min-h-dvh max-w-[393px] overflow-hidden">
            <img
                src="/assets/onboarding-bg.webp"
                alt=""
                className="absolute inset-0 size-full object-cover"
            />

            <div className="relative flex min-h-dvh flex-col px-6 pb-[max(env(safe-area-inset-bottom),12px)]">
                {/* Figma: 제목 top 179 / 852 ≈ 21% */}
                <div className="pt-[21dvh] pl-[26px]">
                    <h1 className="font-batang text-[30px] leading-[1.5] font-bold tracking-[-0.375px] text-black">
                        멀리 있어도
                        <br />한 들판에
                    </h1>
                    <p className="mt-5 text-base leading-[1.5] font-medium tracking-[-0.2px] text-[#4a4a4a]">
                        말하지 않아도 서로의 안부를 느껴요
                    </p>
                </div>

                <div className="flex flex-1 items-center justify-center py-6">
                    <img
                        src="/assets/onboarding-sheep.webp"
                        alt="눈을 감고 쉬고 있는 양"
                        width={243}
                        height={192}
                        className="w-[243px] -translate-x-1"
                    />
                </div>

                <Link
                    to="/signup"
                    className="flex h-14 items-center justify-center rounded-[14px] bg-primary text-base font-bold tracking-[-0.2px] text-white"
                >
                    시작하기
                </Link>
                {/* Figma에는 없는 링크. 다른 기기에서 가입한 사람이 로그인할 길이 필요하다 (기디 확인 필요) */}
                <p className="py-3 text-center text-sm font-medium text-primary">
                    이미 계정이 있어요 ·{' '}
                    <Link to="/login" className="font-bold underline">
                        로그인
                    </Link>
                </p>
            </div>
        </main>
    );
}
