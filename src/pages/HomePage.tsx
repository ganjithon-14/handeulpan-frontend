import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router';

import { getMyPastures } from '@/api/pastures';
import { PagePlaceholder } from '@/pages/PagePlaceholder';
import { useAuthStore } from '@/stores/authStore';
import { usePastureStore } from '@/stores/pastureStore';

/**
 * `/` 첫 진입 분기.
 * 토큰 없음 → 온보딩 / 들판 있음 → 최근에 연 들판(목록에 없으면 첫 번째) / 들판 없음 → 만들기
 */
export function HomePage() {
    const navigate = useNavigate();
    const deviceToken = useAuthStore((state) => state.deviceToken);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        if (!deviceToken) return;
        let ignore = false; // StrictMode에서 두 번 돌거나 화면을 떠난 뒤 응답이 와도 무시

        getMyPastures()
            .then((pastures) => {
                if (ignore) return;
                // 최근 값은 응답 시점에 읽는다. 의존성에 넣으면 값이 바뀔 때마다 다시 불러온다.
                const { lastPastureId } = usePastureStore.getState();
                const target =
                    pastures.find((pasture) => pasture.pastureId === lastPastureId) ?? pastures[0];
                navigate(target ? `/p/${target.pastureId}` : '/new', { replace: true });
            })
            // 401은 API 클라이언트가 로그인으로 보낸다. 여기서는 그 밖의 실패만 보여준다.
            .catch(() => !ignore && setFailed(true));

        return () => {
            ignore = true;
        };
    }, [deviceToken, navigate]);

    if (!deviceToken) return <Navigate to="/onboarding" replace />;

    if (failed) {
        return (
            <PagePlaceholder title="들판을 불러오지 못했어요">
                <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="mt-4 rounded-xl bg-primary px-6 py-3 font-bold text-white"
                >
                    다시 시도
                </button>
            </PagePlaceholder>
        );
    }

    return <PagePlaceholder title="들판으로 가는 중…" />;
}
