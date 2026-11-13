import { useParams } from 'react-router';

import { PagePlaceholder } from '@/pages/PagePlaceholder';

/** `/p/:pastureId/join` 합류: 양 이름·털 색·동의 (6번 이슈) */
export function JoinPage() {
    const { pastureId } = useParams();
    return (
        <PagePlaceholder title="합류">
            <p className="text-sm text-primary">{pastureId}</p>
        </PagePlaceholder>
    );
}
