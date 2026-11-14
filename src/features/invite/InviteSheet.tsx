import { useInviteLink } from '@/features/invite/useInviteLink';
import { BottomSheet } from '@/shared/ui/BottomSheet';
import { SheetNotice } from '@/shared/ui/SheetNotice';

/** 친구 초대 시트 (Figma 199:13740): 탭바 '초대'를 누르면 뜬다 */
export function InviteSheet({
    pastureId,
    open,
    onClose,
}: {
    pastureId: string;
    open: boolean;
    onClose: () => void;
}) {
    const { inviteUrl, copied, notice, copyLink } = useInviteLink(pastureId);

    // 폰이면 공유창(카카오톡 등)을 띄우고, 공유창이 없는 브라우저면 복사로 대신한다
    async function shareLink() {
        if (!navigator.share) {
            await copyLink();
            return;
        }
        try {
            await navigator.share({ title: '한 들판', url: inviteUrl });
        } catch {
            // 사용자가 공유창을 닫은 경우. 할 일 없음
        }
    }

    return (
        <BottomSheet open={open} onClose={onClose} label="친구 초대하기">
            <p className="font-batang text-xs leading-7 font-bold text-leaf">
                함께할수록 들판은 더 포근해져요
            </p>
            <h2 className="text-xl leading-[1.36] font-semibold tracking-[-0.2px] text-[#0f0f10]">
                친구들 들판으로 초대하기
            </h2>

            <img
                src="/assets/sheep-cream-happy.webp"
                alt=""
                width={122}
                height={118}
                className="mx-auto mt-5 h-[118px] w-[122px] object-contain"
            />

            <div className="mt-[30px] flex flex-col gap-2">
                <div className="relative flex h-[60px] items-center gap-3 rounded-2xl border border-line bg-[#fffcf4] px-4">
                    <SheetNotice
                        text={
                            notice &&
                            (notice === 'failed'
                                ? '복사가 안 됐어요. 링크를 길게 눌러 복사해 주세요.'
                                : '링크를 복사했어요')
                        }
                    />
                    <span className="min-w-0 flex-1 truncate font-dodum text-[11px] leading-[16.5px] text-black select-all">
                        {inviteUrl.replace(/^https?:\/\//, '')}
                    </span>
                    <button
                        type="button"
                        onClick={copyLink}
                        aria-label={copied ? '복사했어요' : '링크 복사'}
                        className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-line"
                    >
                        <img src="/assets/icon-copy.svg" alt="" width={18} height={18} />
                    </button>
                </div>
                <button
                    type="button"
                    onClick={shareLink}
                    className="h-[60px] rounded-2xl bg-primary px-4 text-left text-sm leading-[19.5px] font-semibold text-white"
                >
                    초대 링크 공유하기
                </button>
            </div>
        </BottomSheet>
    );
}
