import type { PastureSheep } from '@/api/types';

/** 받침 있는 이름이면 '이', 없으면 '가' (두부가 / 구름이). 한글이 아니면 '가' */
function subjectParticle(name: string) {
    const code = name.charCodeAt(name.length - 1) - 0xac00;
    if (code < 0 || code > 11171) return '가';
    return code % 28 === 0 ? '가' : '이';
}

/**
 * 멀어짐 배너 (Figma 187:10479): 가장자리(EDGE)에 간 친구마다 한 장씩 쌓는다.
 * 누르면 그 친구에게 다가가기 시트를 연다. 들판 화면(FE-A)은 이걸 import해서 제목 아래에 붙인다.
 * 너비는 부모를 꽉 채운다 (Figma 393 화면에서 좌우 24px → 345px). 좁은 폰에서는 이름이 잘린다.
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
                        className="flex min-h-[62px] w-full items-center gap-3 rounded-[18px] border border-line bg-[#fff9ef] py-2.5 pr-2.5 pl-[21px] text-left shadow-[0_12px_17.5px_rgba(66,84,56,0.12)] backdrop-blur-[12px]"
                    >
                        <span className="flex min-w-0 flex-1 flex-col gap-1">
                            <span className="truncate text-[14px] leading-[17.5px] font-semibold text-black">
                                {friend.name}
                                {subjectParticle(friend.name)} 조금 멀리 갔어요
                            </span>
                            <span className="text-[11px] leading-[13.75px] font-medium text-primary">
                                천천히 안부를 건네볼까요?
                            </span>
                        </span>
                        <img
                            src="/assets/icon-arrow.svg"
                            alt=""
                            width={19}
                            height={19}
                            className="shrink-0"
                        />
                    </button>
                </li>
            ))}
        </ul>
    );
}
