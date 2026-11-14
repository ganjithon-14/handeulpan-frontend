import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { ERROR_CODE, toApiError } from '@/api/errors';
import { getPasture } from '@/api/pastures';
import type { Pasture } from '@/api/types';
import { FieldTabBar } from '@/features/fieldNav/FieldTabBar';
import { PastureTitle } from '@/features/fieldNav/PastureTitle';
import { InviteLanding } from '@/features/invite/InviteLanding';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { PagePlaceholder } from '@/pages/PagePlaceholder';
import { useAuthStore } from '@/stores/authStore';
import { usePastureStore } from '@/stores/pastureStore';

type View = 'loading' | 'member' | 'guest' | 'notFound' | 'error';

/**
 * `/p/:pastureId` 멤버면 들판 메인(FE-A), 아니면 초대 랜딩(FE-B).
 * 멤버인지 알려주는 API가 따로 없어서 들판 조회의 NOT_PASTURE_MEMBER로 나눈다.
 * `?demo=1`이면 데모 패널을 띄운다 (8번 이슈).
 */
export function PasturePage() {
    const { pastureId = '' } = useParams();
    const hasToken = useAuthStore((state) => Boolean(state.deviceToken));
    const setLastPastureId = usePastureStore((state) => state.setLastPastureId);
    // 어느 들판의 결과인지 같이 둬서, 들판을 바꾸면 새 결과가 올 때까지 loading이 된다
    const [result, setResult] = useState<{
        pastureId: string;
        view: View;
        pasture?: Pasture;
    } | null>(null);

    // 토큰이 없으면 멤버일 수 없으니 조회 없이 바로 초대 랜딩
    let view: View = 'guest';
    if (hasToken) view = result?.pastureId === pastureId ? result.view : 'loading';

    useEffect(() => {
        if (!hasToken) return;
        const done = (next: View, pasture?: Pasture) =>
            setResult({ pastureId, view: next, pasture });
        getPasture(pastureId)
            .then((pasture) => {
                // 다음에 `/`로 들어오면 이 들판으로 오게 기억한다
                setLastPastureId(pastureId);
                done('member', pasture);
            })
            .catch((caught) => {
                const { code } = toApiError(caught);
                if (code === ERROR_CODE.NOT_PASTURE_MEMBER) done('guest');
                else if (code === ERROR_CODE.PASTURE_NOT_FOUND) done('notFound');
                else done('error');
            });
    }, [pastureId, hasToken, setLastPastureId]);

    switch (view) {
        case 'guest':
            return <InviteLanding pastureId={pastureId} />;
        case 'notFound':
            return <NotFoundPage />;
        case 'error':
            return (
                <PagePlaceholder title="들판">
                    <p className="text-sm text-primary">잠시 후 다시 시도해 주세요.</p>
                </PagePlaceholder>
            );
        case 'member':
            // TODO(FE-A): 들판 메인 화면. 위 제목과 아래 탭바는 FE-B 컴포넌트를 그대로 붙인다
            return (
                <main className="relative mx-auto min-h-dvh max-w-[393px] bg-cream px-6 pt-8">
                    <PastureTitle pastureId={pastureId} name={result?.pasture?.name ?? ''} />
                    <FieldTabBar pastureId={pastureId} />
                </main>
            );
        default:
            return <main className="min-h-dvh bg-cream" />;
    }
}
