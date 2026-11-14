import { useState } from 'react';
import { Link } from 'react-router';

/**
 * 들판을 만든 뒤 보는 초대 링크 공유 화면 (Figma '링크 공유 페이지' 67:2030).
 * 온보딩처럼 Figma 고정 좌표 대신 세로 배치: 문구 위, 양 가운데, 버튼 아래.
 */
export function InviteShare({ pastureId }: { pastureId: string }) {
    const inviteUrl = `${window.location.origin}/p/${pastureId}`;
    const [copied, setCopied] = useState(false);
    const [copyFailed, setCopyFailed] = useState(false);

    async function copyLink() {
        try {
            // http 주소(폰으로 연 개발 서버 등)에서는 navigator.clipboard가 없어서 여기서 throw된다
            await navigator.clipboard.writeText(inviteUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopyFailed(true);
        }
    }

    return (
        <main className="relative mx-auto min-h-dvh max-w-[393px] overflow-hidden">
            <img
                src="/assets/invite-bg.webp"
                alt=""
                className="absolute inset-0 size-full object-cover"
            />

            <div className="relative flex min-h-dvh flex-col px-6 pb-[max(env(safe-area-inset-bottom),12px)]">
                {/* Figma: 문구 top 140 / 852 ≈ 16% */}
                <div className="pt-[16dvh]">
                    <p className="font-dodum text-sm leading-7 text-leaf">
                        함께할수록 들판은 더 포근해져요
                    </p>
                    <h1 className="text-2xl leading-[1.36] font-semibold tracking-[-0.24px] text-[#0f0f10]">
                        친구들 들판으로 초대하기
                    </h1>
                </div>

                <div className="flex flex-1 items-center justify-center py-6">
                    <img
                        src="/assets/sheep-cream-happy.webp"
                        alt="기뻐하는 양"
                        width={243}
                        height={237}
                        className="w-[243px]"
                    />
                </div>

                {copyFailed && (
                    <p role="alert" className="mb-3 rounded-[14px] bg-soft p-3 text-sm">
                        복사가 안 됐어요. 링크를 길게 눌러 복사해 주세요.
                        <span className="mt-1 block font-bold break-all select-all">
                            {inviteUrl}
                        </span>
                    </p>
                )}

                <div className="flex flex-col gap-3">
                    <button
                        type="button"
                        onClick={copyLink}
                        className="h-14 rounded-[14px] bg-soft text-base font-bold tracking-[-0.2px] text-black"
                    >
                        {copied ? '복사했어요' : '링크 복사'}
                    </button>
                    <Link
                        to={`/p/${pastureId}`}
                        replace
                        className="flex h-14 items-center justify-center rounded-[14px] bg-primary text-base font-bold tracking-[-0.2px] text-white"
                    >
                        들판으로 가기
                    </Link>
                </div>
            </div>
        </main>
    );
}
