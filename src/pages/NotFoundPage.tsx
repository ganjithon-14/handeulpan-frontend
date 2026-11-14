import { Link } from 'react-router';

import { PagePlaceholder } from '@/pages/PagePlaceholder';

/** 없는 주소 */
export function NotFoundPage() {
    return (
        <PagePlaceholder title="길을 잃었어요">
            <Link to="/" className="text-sm text-primary underline">
                처음으로
            </Link>
        </PagePlaceholder>
    );
}
