import { useEffect, useState } from 'react';
import { Link } from 'react-router';

import { ERROR_CODE, toApiError } from '@/api/errors';
import { getPasturePreview } from '@/api/pastures';
import type { PasturePreview } from '@/api/types';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { PageHeader } from '@/shared/ui/PageHeader';

/**
 * 양을 놓을 자리 (Figma 130:5353 기준, 393×852 화면 비율).
 * 앞 세 자리는 Figma 양 위치, 4~6번째는 들판이 가득 찰 때를 위해 빈 풀밭에 둔 자리.
 * Figma는 같은 크림 양 일러스트지만, 실제 친구 양을 털 색대로 보여 준다.
 */
const SHEEP_SLOTS = [
    { left: 78, top: 43, width: 111 },
    { left: 223, top: 48, width: 125 },
    { left: 95, top: 56, width: 115 },
    { left: 16, top: 50, width: 80 },
    { left: 285, top: 38, width: 80 },
    { left: 170, top: 39, width: 75 },
];

/**
 * 초대 랜딩 (Figma 130:5353 합류 가능 / 130:5383 가득 참).
 * 토큰 없이 부르는 미리보기 API로 그린다. 버튼은 합류 화면으로 가고,
 * 토큰이 없으면 합류 화면의 RequireAuth가 가입을 거쳐 돌려보낸다.
 */
export function InviteLanding({ pastureId }: { pastureId: string }) {
    const [preview, setPreview] = useState<PasturePreview | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getPasturePreview(pastureId)
            .then(setPreview)
            .catch((caught) => setError(toApiError(caught).code));
    }, [pastureId]);

    if (error === ERROR_CODE.PASTURE_NOT_FOUND) return <NotFoundPage />;

    return (
        <main className="relative mx-auto min-h-dvh max-w-[393px] overflow-hidden">
            <img
                src="/assets/invite-bg.webp"
                alt=""
                className="absolute inset-0 size-full object-cover"
            />

            <div className="relative px-6">
                <PageHeader fallback="/" />
            </div>

            {error && (
                <p role="alert" className="relative mt-[10dvh] text-center text-sm text-[#684218]">
                    들판을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
                </p>
            )}

            {preview && (
                <>
                    {/* Figma: 문구 top 162 / 852 ≈ 19% (헤더 높이를 뺀 만큼) */}
                    <div className="relative mx-auto mt-[10dvh] flex w-fit flex-col items-center gap-3 text-center">
                        <p className="font-dodum text-base leading-[16.5px] text-[#684218]">
                            친구가 초대한 들판
                        </p>
                        <h1 className="text-[30px] leading-[45px] font-bold tracking-[-1.35px] text-[#684218]">
                            {preview.name}
                        </h1>
                        <p className="flex items-center gap-1.5 rounded-[22px] border border-[rgba(126,88,33,0.11)] bg-[rgba(255,249,229,0.88)] px-4 py-[9px] text-xs leading-[15px] font-bold text-[#765123] shadow-[0_4px_10px_rgba(94,76,38,0.11)]">
                            <img src="/assets/icon-flower.webp" alt="" className="size-[18px]" />
                            함께하는 양
                            <span className="ml-0.5">
                                {preview.sheep.length}/{preview.maxSheep}마리
                            </span>
                        </p>
                    </div>

                    {preview.sheep.slice(0, SHEEP_SLOTS.length).map((sheep, index) => {
                        const slot = SHEEP_SLOTS[index];
                        return (
                            <img
                                key={index}
                                src={`/assets/sheep-${sheep.woolColor.toLowerCase()}.webp`}
                                alt={`${sheep.name} 양`}
                                className="absolute opacity-90"
                                style={{
                                    left: `${(slot.left / 393) * 100}%`,
                                    top: `${slot.top}%`,
                                    width: `${(slot.width / 393) * 100}%`,
                                }}
                            />
                        );
                    })}

                    <section className="absolute inset-x-0 bottom-0 flex h-[215px] flex-col items-center rounded-t-[60px] bg-[#fffcf4] px-6 pt-[22px] pb-[max(env(safe-area-inset-bottom),12px)] text-center">
                        <Sparkle />
                        <h2 className="mt-2 text-xl leading-[1.36] font-semibold tracking-[-0.2px] text-[#0f0f10]">
                            {preview.full
                                ? '이 들판은 양들로 가득 찼어요!'
                                : '친구들의 양이 기다리고 있어요!'}
                        </h2>
                        <p className="mt-3 w-[243px] text-sm leading-[18.7px] font-medium break-keep text-[#755d40]">
                            {preview.full
                                ? '아쉽지만 지금은 새로운 친구가 들어올 자리가 없어요'
                                : '같은 들판에서 서로의 안부를 느껴요'}
                        </p>
                        {!preview.full && (
                            <Link
                                to={`/p/${pastureId}/join`}
                                className="mt-auto mb-3 flex h-14 w-full items-center justify-center rounded-[14px] bg-primary text-base font-bold tracking-[-0.2px] text-white"
                            >
                                내 양 풀어놓기
                            </Link>
                        )}
                    </section>
                </>
            )}
        </main>
    );
}

/** Figma 문구 위 노란 빛 세 줄 */
function Sparkle() {
    const bar = 'h-[13px] w-1 rounded-[3px] bg-[#efbd3e]';
    return (
        <div aria-hidden className="flex h-[17px] items-end gap-1.5">
            <span className={`${bar} -rotate-[28deg]`} />
            <span className={`${bar} self-start`} />
            <span className={`${bar} rotate-[28deg]`} />
        </div>
    );
}
