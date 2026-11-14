export type TabKey = 'home' | 'bubble' | 'scarf' | 'invite';

const TABS: { key: TabKey; label: string; icon: string; width: number; height: number }[] = [
    { key: 'home', label: '홈', icon: '/assets/icon-home.svg', width: 24, height: 24 },
    { key: 'bubble', label: '한마디', icon: '/assets/icon-chat.svg', width: 24, height: 24 },
    { key: 'scarf', label: '목도리', icon: '/assets/icon-scarf.svg', width: 24, height: 22 },
    { key: 'invite', label: '초대', icon: '/assets/icon-person-add.svg', width: 24, height: 24 },
];

/**
 * 들판 아래쪽 탭 4개 (Figma 165:5953). 모양만 그리고, 누르면 무엇을 할지는 쓰는 쪽이 정한다.
 * 들판 화면에서는 시트까지 연결된 `features/fieldNav/FieldTabBar`를 쓴다.
 */
export function TabBar({ active, onSelect }: { active: TabKey; onSelect: (tab: TabKey) => void }) {
    return (
        <nav
            aria-label="들판 메뉴"
            className="flex h-[68px] w-full items-center justify-center gap-2.5 rounded-[42px] border border-[rgba(112,84,49,0.08)] bg-[rgba(255,252,244,0.94)] shadow-[0_12px_32px_rgba(78,63,37,0.16),0_2px_8px_rgba(78,63,37,0.08)] backdrop-blur-[22px]"
        >
            {TABS.map(({ key, label, icon, width, height }) => (
                <button
                    key={key}
                    type="button"
                    onClick={() => onSelect(key)}
                    aria-current={active === key ? 'page' : undefined}
                    className={`flex h-[47px] w-[65px] flex-col items-center justify-center gap-1 rounded-[34px] text-[10px] font-medium text-primary ${active === key ? 'bg-line' : ''}`}
                >
                    <img src={icon} alt="" width={width} height={height} />
                    {label}
                </button>
            ))}
        </nav>
    );
}
