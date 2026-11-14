import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { getMyPastures } from '@/api/pastures';
import type { PastureSummary } from '@/api/types';
import { BottomSheet } from '@/shared/ui/BottomSheet';

/**
 * 들판 왼쪽 위 "우리의 들판 / {이름} ⌄" (Figma 들판 메인).
 * 누르면 나의 들판 시트(Figma 191:10882)가 열려 들판을 바꾸거나 새로 만든다.
 */
export function PastureTitle({ pastureId, name }: { pastureId: string; name: string }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="flex items-center gap-3 text-left font-batang leading-7 font-bold"
            >
                <span className="flex flex-col">
                    <span className="text-sm text-[#175b00]">우리의 들판</span>
                    <span className="text-xl text-black">{name}</span>
                </span>
                {/* 원본 화살표는 왼쪽을 보고 있어서 돌려서 아래를 보게 한다 (Figma도 같은 방식) */}
                <img
                    src="/assets/icon-chevron.svg"
                    alt="들판 바꾸기"
                    width={9.7}
                    height={17}
                    className="-rotate-90"
                />
            </button>
            <PastureSheet pastureId={pastureId} open={open} onClose={() => setOpen(false)} />
        </>
    );
}

function PastureSheet({
    pastureId,
    open,
    onClose,
}: {
    pastureId: string;
    open: boolean;
    onClose: () => void;
}) {
    const navigate = useNavigate();
    const [pastures, setPastures] = useState<PastureSummary[] | null>(null);
    const [failed, setFailed] = useState(false);

    // 열 때마다 새로 불러온다: 다른 기기에서 들판에 합류했을 수 있다
    useEffect(() => {
        if (!open) return;
        getMyPastures()
            .then((list) => {
                setPastures(list);
                setFailed(false);
            })
            .catch(() => setFailed(true));
    }, [open]);

    function select(id: string) {
        onClose();
        if (id !== pastureId) navigate(`/p/${id}`);
    }

    return (
        <BottomSheet open={open} onClose={onClose} label="나의 들판">
            <h2 className="text-xl leading-[1.36] font-semibold tracking-[-0.2px] text-[#0f0f10]">
                나의 들판
            </h2>

            {failed && (
                <p role="alert" className="mt-5 text-sm text-red-700">
                    들판 목록을 불러오지 못했어요.
                </p>
            )}

            {/* shortcut: 서버 목록에 양 수가 없어 Figma의 '{n}마리의 양이 함께 있어요'를 뺐다. BE에 sheepCount 요청 */}
            <ul className="mt-5 flex max-h-[40dvh] flex-col gap-2 overflow-y-auto">
                {pastures?.map((pasture) => {
                    const current = pasture.pastureId === pastureId;
                    return (
                        <li key={pasture.pastureId}>
                            <button
                                type="button"
                                onClick={() => select(pasture.pastureId)}
                                aria-current={current ? 'page' : undefined}
                                className={`flex h-[60px] w-full items-center gap-3 rounded-2xl border px-4 text-left text-sm leading-[19.5px] font-semibold text-black ${current ? 'border-primary bg-[rgba(232,220,203,0.45)]' : 'border-line bg-cream'}`}
                            >
                                <span className="min-w-0 flex-1 truncate">{pasture.name}</span>
                                {current && (
                                    <img
                                        src="/assets/icon-selected.svg"
                                        alt=""
                                        width={20}
                                        height={20}
                                    />
                                )}
                            </button>
                        </li>
                    );
                })}
            </ul>

            <Link
                to="/new"
                onClick={onClose}
                className="mt-4 flex h-14 items-center justify-center rounded-2xl border border-dashed border-line text-sm leading-[19.5px] text-black"
            >
                + 새 들판 만들기
            </Link>
        </BottomSheet>
    );
}
