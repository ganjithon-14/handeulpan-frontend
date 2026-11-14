import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';

import { ERROR_CODE, toApiError } from '@/api/errors';
import { getPasture } from '@/api/pastures';
import type { Pasture, PastureSheep } from '@/api/types';
import { DemoPanel } from '@/features/demo/DemoPanel';
import { FieldTabBar } from '@/features/fieldNav/FieldTabBar';
import { PastureTitle } from '@/features/fieldNav/PastureTitle';
import { InviteLanding } from '@/features/invite/InviteLanding';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ReachOutBanner } from '@/features/reachOut/ReachOutBanner';
import { ReachOutSheet } from '@/features/reachOut/ReachOutSheet';
import { PagePlaceholder } from '@/pages/PagePlaceholder';
import { useAuthStore } from '@/stores/authStore';
import { usePastureStore } from '@/stores/pastureStore';

type View = 'loading' | 'member' | 'guest' | 'notFound' | 'error';

/**
 * `/p/:pastureId` 멤버면 들판 메인(FE-A), 아니면 초대 랜딩(FE-B).
 * 멤버인지 알려주는 API가 따로 없어서 들판 조회의 NOT_PASTURE_MEMBER로 나눈다.
 * `?demo=1`이면 데모 패널을 띄운다.
 */
export function PasturePage() {
    const { pastureId = '' } = useParams();
    const [searchParams] = useSearchParams();
    const isDemo = searchParams.get('demo') === '1';
    // 다가가기 시트를 연 친구. 객체 대신 id를 둬서 목도리를 보낸 뒤 바뀐 값이 시트에 바로 보이게 한다
    const [reachOutId, setReachOutId] = useState<number | null>(null);
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

    // 되감기·목도리 보내기 결과를 들판을 다시 불러오지 않고 그 양에만 반영한다
    function updateSheep(sheepId: number, patch: Partial<PastureSheep>) {
        setResult((prev) =>
            prev?.pasture
                ? {
                      ...prev,
                      pasture: {
                          ...prev.pasture,
                          sheep: prev.pasture.sheep.map((sheep) =>
                              sheep.id === sheepId ? { ...sheep, ...patch } : sheep,
                          ),
                      },
                  }
                : prev,
        );
    }

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
        case 'member': {
            // TODO(FE-A): 들판 메인 화면. 위 제목·멀어짐 배너·탭바·데모 패널은 FE-B 컴포넌트를 그대로 붙인다
            const sheep = result?.pasture?.sheep ?? [];
            return (
                <main className="relative mx-auto min-h-dvh max-w-[393px] bg-cream px-6 pt-8">
                    <PastureTitle pastureId={pastureId} name={result?.pasture?.name ?? ''} />
                    {/* Figma: 제목 아래 18px에 배너 */}
                    <div className="mt-[18px]">
                        <ReachOutBanner sheep={sheep} onSelect={({ id }) => setReachOutId(id)} />
                    </div>
                    <ReachOutSheet
                        sheep={sheep.find(({ id }) => id === reachOutId) ?? null}
                        onClose={() => setReachOutId(null)}
                        onScarfSent={(sheepId) => updateSheep(sheepId, { sentScarfToday: true })}
                    />
                    {isDemo && (
                        <DemoPanel
                            sheep={sheep}
                            onRewound={(sheepId, distance) => updateSheep(sheepId, { distance })}
                        />
                    )}
                    <FieldTabBar pastureId={pastureId} />
                </main>
            );
        }
        default:
            return <main className="min-h-dvh bg-cream" />;
    }
}
