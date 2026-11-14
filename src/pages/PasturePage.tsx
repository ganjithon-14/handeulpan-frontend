import { useEffect } from 'react';
import { useParams } from 'react-router';

import { PagePlaceholder } from '@/pages/PagePlaceholder';
import { usePastureStore } from '@/stores/pastureStore';

/**
 * `/p/:pastureId` 멤버면 들판 메인(FE-A), 아니면 초대 랜딩(FE-B, 6번 이슈).
 * `?demo=1`이면 데모 패널을 띄운다 (8번 이슈).
 */
export function PasturePage() {
    const { pastureId } = useParams();
    const setLastPastureId = usePastureStore((state) => state.setLastPastureId);

    // 다음에 `/`로 들어오면 이 들판으로 오게 기억한다.
    // 멤버가 아닌 들판(초대 미리보기)이 저장돼도 첫 진입 때 내 목록에 없으면 무시된다.
    useEffect(() => {
        if (pastureId) setLastPastureId(pastureId);
    }, [pastureId, setLastPastureId]);

    return (
        <PagePlaceholder title="들판">
            <p className="text-sm text-primary">{pastureId}</p>
        </PagePlaceholder>
    );
}
