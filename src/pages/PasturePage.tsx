import { useParams } from 'react-router';

import { PagePlaceholder } from '@/pages/PagePlaceholder';

/**
 * `/p/:pastureId` 멤버면 들판 메인(FE-A), 아니면 초대 랜딩(FE-B, 6번 이슈).
 * `?demo=1`이면 데모 패널을 띄운다 (8번 이슈).
 */
export function PasturePage() {
    const { pastureId } = useParams();
    return (
        <PagePlaceholder title="들판">
            <p className="text-sm text-primary">{pastureId}</p>
        </PagePlaceholder>
    );
}
