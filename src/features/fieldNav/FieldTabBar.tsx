import { useState } from 'react';

import { InviteSheet } from '@/features/invite/InviteSheet';
import { TabBar, type TabKey } from '@/shared/ui/TabBar';

/**
 * 들판 화면용 탭바: 탭을 누르면 해당 시트를 연다. FE-A 들판 화면은 이것만 붙이면 된다.
 * 화면 아래에 떠 있도록 fixed로 둔다 (Figma: 아래에서 48px, 좌우 24px).
 */
export function FieldTabBar({ pastureId }: { pastureId: string }) {
    const [sheet, setSheet] = useState<'invite' | null>(null);

    function handleSelect(tab: TabKey) {
        if (tab === 'home') setSheet(null);
        if (tab === 'invite') setSheet('invite');
        // TODO: 한마디(11번)·목도리(10번) 시트가 생기면 여기서 연다
    }

    return (
        <>
            <div className="fixed inset-x-0 bottom-[max(env(safe-area-inset-bottom),48px)] mx-auto max-w-[393px] px-6">
                <TabBar active={sheet ?? 'home'} onSelect={handleSelect} />
            </div>
            <InviteSheet
                pastureId={pastureId}
                open={sheet === 'invite'}
                onClose={() => setSheet(null)}
            />
        </>
    );
}
