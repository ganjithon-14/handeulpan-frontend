import { useState } from 'react';

import { ERROR_CODE, toApiError } from '@/api/errors';
import { sendScarf } from '@/api/sheep';
import type { PastureSheep } from '@/api/types';
import { BottomSheet } from '@/shared/ui/BottomSheet';
import { useCopy } from '@/shared/useCopy';

/**
 * 말 걸기 가이드 문장. 첫 문장은 Figma 그대로.
 * TODO(기디): 2·3번은 Figma가 비어 있어 FE-B가 제안한 문구. 확정되면 바꾼다
 */
const GREETINGS = [
    '요즘 어떻게 지내? 갑자기 생각나서 연락해봤어.',
    '지나가다 네 생각 났어. 밥은 잘 챙겨 먹고 있지?',
    '바쁘면 답장 천천히 해도 돼. 그냥 안부 궁금했어.',
];

/**
 * 다가가기 시트 (Figma 183:9687): 멀어진 친구에게 목도리를 보내거나, 안부 문장을 복사해
 * 메신저로 직접 말을 건다. sheep이 null이면 닫혀 있다.
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
    const [message, setMessage] = useState('');
    const { notice, copy } = useCopy();

    function close() {
        setMessage('');
        onClose();
    }

    async function send(sheepId: number) {
        setSending(true);
        setMessage('');
        try {
            await sendScarf(sheepId);
            onScarfSent(sheepId);
            setMessage('목도리를 보냈어요.');
        } catch (caught) {
            const { code } = toApiError(caught);
            if (code === ERROR_CODE.ALREADY_SENT_TODAY) {
                // 다른 기기에서 이미 보냈을 수 있다. 화면도 보낸 상태로 맞춘다
                onScarfSent(sheepId);
                setMessage('오늘은 이미 목도리를 보냈어요.');
            } else if (code === ERROR_CODE.SELF) {
                setMessage('내 양에게는 목도리를 보낼 수 없어요.');
            } else {
                setMessage('보내지 못했어요. 잠시 후 다시 시도해 주세요.');
            }
        } finally {
            setSending(false);
        }
    }

    return (
        <BottomSheet open={sheep !== null} onClose={close} label="다가가기">
            {sheep && (
                <>
                    <p className="font-batang text-xs leading-7 font-bold text-leaf">
                        조금 멀어진 친구
                    </p>
                    <h2 className="text-xl leading-[1.36] font-semibold tracking-[-0.2px] text-[#0f0f10]">
                        {sheep.name}에게 다가가기
                    </h2>

                    <img
                        src={`/assets/sheep-${sheep.woolColor.toLowerCase()}.webp`}
                        alt=""
                        width={150}
                        height={122}
                        className="mx-auto mt-3 h-[122px] w-[150px] object-contain"
                    />

                    <button
                        type="button"
                        disabled={sending || sheep.sentScarfToday}
                        onClick={() => send(sheep.id)}
                        className="mt-5 flex h-[60px] w-full items-center justify-between rounded-2xl bg-primary px-4 text-sm leading-[19.5px] font-semibold text-white disabled:bg-primary-disabled"
                    >
                        {sheep.sentScarfToday ? '오늘 목도리를 보냈어요' : '목도리 보내기'}
                        <span aria-hidden>→</span>
                    </button>
                    <p role="status" className="mt-2 min-h-4 text-center text-xs text-subtle">
                        {message}
                    </p>

                    <div className="mt-3 flex items-center gap-3">
                        <span className="text-xs text-[#45463f]">이렇게 말을 건네보세요</span>
                        <span aria-hidden className="h-px flex-1 bg-[#45463f]" />
                    </div>

                    <div className="relative mt-3">
                        {/* 목록 위에 떴다가 사라지는 안내. absolute라서 시트 높이가 바뀌지 않는다 */}
                        <p
                            role="status"
                            className={`pointer-events-none absolute bottom-full left-1/2 mb-2 w-max -translate-x-1/2 rounded-full bg-black/75 px-3 py-1.5 text-xs text-white transition-opacity duration-300 ${notice ? 'opacity-100' : 'opacity-0'}`}
                        >
                            {notice === 'failed'
                                ? '복사가 안 됐어요. 문장을 길게 눌러 복사해 주세요.'
                                : '문장을 복사했어요'}
                        </p>
                        <ul className="flex flex-col gap-2">
                            {GREETINGS.map((text) => (
                                <li
                                    key={text}
                                    className="flex min-h-[60px] items-center gap-3 rounded-2xl border border-line px-4 py-2"
                                >
                                    <span className="min-w-0 flex-1 text-xs leading-[18px] text-black select-all">
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
