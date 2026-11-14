import { useState } from 'react';

import { ERROR_CODE, toApiError } from '@/api/errors';
import { sendScarf } from '@/api/sheep';
import type { PastureSheep } from '@/api/types';
import { BottomSheet } from '@/shared/ui/BottomSheet';
import { SheetNotice } from '@/shared/ui/SheetNotice';
import { useCopy } from '@/shared/useCopy';
import { useFlash } from '@/shared/useFlash';

/** 말 걸기 가이드 문장. 첫 문장은 Figma, 둘째는 답장 부담을 덜어 주는 문장 */
const GREETINGS = [
    '요즘 어떻게 지내? 갑자기 생각나서 연락해봤어.',
    '바쁘면 답장 천천히 해도 돼. 그냥 안부 궁금했어.',
];

/**
 * 다가가기 시트 (Figma 183:9687): 멀어진 친구에게 목도리를 보내거나, 안부 문장을 복사해
 * 메신저로 직접 말을 건다. sheep이 null이면 닫혀 있다.
 * 크기는 Figma px 그대로, 너비만 화면에 맞춰 늘고 준다 (393 화면에서 내용 351px).
 */
export function ReachOutSheet({
    sheep,
    onClose,
    onScarfSent,
}: {
    sheep: PastureSheep | null;
    onClose: () => void;
    /** 보냈거나 이미 보낸 상태면 불린다. 들판의 sentScarfToday를 true로 바꾸는 데 쓴다 */
    onScarfSent: (sheepId: number) => void;
}) {
    const [sending, setSending] = useState(false);
    const sendNotice = useFlash<string>();
    const { notice: copyNotice, copy } = useCopy();

    async function send(sheepId: number) {
        setSending(true);
        try {
            await sendScarf(sheepId);
            onScarfSent(sheepId);
            sendNotice.flash('목도리를 보냈어요.');
        } catch (caught) {
            const { code } = toApiError(caught);
            if (code === ERROR_CODE.ALREADY_SENT_TODAY) {
                // 다른 기기에서 이미 보냈을 수 있다. 화면도 보낸 상태로 맞춘다
                onScarfSent(sheepId);
                sendNotice.flash('오늘은 이미 목도리를 보냈어요.');
            } else if (code === ERROR_CODE.SELF) {
                sendNotice.flash('내 양에게는 목도리를 보낼 수 없어요.');
            } else {
                sendNotice.flash('보내지 못했어요. 잠시 후 다시 시도해 주세요.');
            }
        } finally {
            setSending(false);
        }
    }

    return (
        <BottomSheet open={sheep !== null} onClose={onClose} label="다가가기">
            {sheep && (
                <>
                    <p className="font-batang text-[14px] leading-7 font-bold text-leaf">
                        조금 멀어진 친구
                    </p>
                    <h2 className="text-[20px] leading-[1.36] font-semibold tracking-[-0.2px] text-[#0f0f10]">
                        {sheep.name}에게 다가가기
                    </h2>

                    {/* 멀어짐(가장자리) 포즈, 친구 털 색 (Figma Design System 4:5) */}
                    <img
                        src={`/assets/sheep-${sheep.woolColor.toLowerCase()}-edge.webp`}
                        alt=""
                        width={150}
                        height={118}
                        className="mx-auto mt-5 h-[118px] w-[150px] object-contain"
                    />

                    <div className="relative mt-[30px]">
                        {/* 보내기 결과는 친구 초대 시트처럼 양과 버튼 사이에 */}
                        <SheetNotice text={sendNotice.notice} />
                        <button
                            type="button"
                            disabled={sending || sheep.sentScarfToday}
                            onClick={() => send(sheep.id)}
                            className="flex h-[60px] w-full items-center gap-3 rounded-2xl bg-primary px-4 py-2.5 text-left text-[14px] leading-[19.5px] font-medium text-white disabled:bg-primary-disabled"
                        >
                            <span className="flex-1">
                                {sheep.sentScarfToday ? '오늘 목도리를 보냈어요' : '목도리 보내기'}
                            </span>
                            <img src="/assets/icon-arrow-white.svg" alt="" width={19} height={19} />
                        </button>
                    </div>

                    <div className="flex items-center gap-3 pt-6">
                        <span className="font-dodum text-[11px] leading-[16.5px] text-primary">
                            이렇게 말을 건네보세요
                        </span>
                        <span aria-hidden className="h-px flex-1 bg-primary" />
                    </div>

                    <div className="relative mt-[11px]">
                        {/* 복사 결과는 마지막 문장 칸 아래에 */}
                        <SheetNotice
                            below
                            text={
                                copyNotice &&
                                (copyNotice === 'failed'
                                    ? '복사가 안 됐어요. 문장을 길게 눌러 복사해 주세요.'
                                    : '문장을 복사했어요')
                            }
                        />
                        <ul className="flex flex-col gap-2">
                            {GREETINGS.map((text) => (
                                <li
                                    key={text}
                                    className="flex min-h-[60px] items-center gap-3 rounded-2xl border border-line bg-[#fffcf4] px-4 py-2.5"
                                >
                                    <span className="min-w-0 flex-1 text-[12px] leading-[19.5px] text-black select-all">
                                        {text}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => copy(text)}
                                        aria-label="문장 복사"
                                        className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-line"
                                    >
                                        <img
                                            src="/assets/icon-copy.svg"
                                            alt=""
                                            width={18}
                                            height={18}
                                        />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </BottomSheet>
    );
}
