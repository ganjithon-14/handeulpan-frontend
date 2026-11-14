import type { PastureSheep } from '@/api/types';

/** 받침 있는 이름이면 '이', 없으면 '가' (두부가 / 구름이). 한글이 아니면 '가' */
function subjectParticle(name: string) {
    const code = name.charCodeAt(name.length - 1) - 0xac00;
    if (code < 0 || code > 11171) return '가';
    return code % 28 === 0 ? '가' : '이';
}

/**
 * 멀어짐 배너 (Figma 186:10390): 가장자리(EDGE)에 간 친구마다 한 장씩 쌓는다.
 * 누르면 그 친구에게 다가가기 시트를 연다. 들판 화면(FE-A)은 이걸 import해서 위쪽에 붙인다.
 */
export function ReachOutBanner({
    sheep,
    onSelect,
}: {
    sheep: PastureSheep[];
    onSelect: (sheep: PastureSheep) => void;
}) {
    const edgeFriends = sheep.filter(({ mine, distance }) => !mine && distance === 'EDGE');
    if (edgeFriends.length === 0) return null;

    return (
        <ul className="flex flex-col gap-2">
            {edgeFriends.map((friend) => (
                <li key={friend.id}>
                    <button
                        type="button"
                        onClick={() => onSelect(friend)}
                        className="flex w-full items-center gap-3 rounded-2xl bg-[#fffcf4] px-5 py-4 text-left shadow-sm"
                    >
                        <span className="min-w-0 flex-1">
                            <span className="block truncate text-[15px] font-semibold text-[#0f0f10]">
                                {friend.name}
                                {subjectParticle(friend.name)} 조금 멀리 갔어요
                            </span>
                            <span className="mt-1 block text-[11px] text-[#45463f]">
                                천천히 안부를 건네볼까요?
                            </span>
                        </span>
                        <span aria-hidden className="text-lg text-[#0f0f10]">
                            →
                        </span>
                    </button>
                </li>
            ))}
        </ul>
    );
}
