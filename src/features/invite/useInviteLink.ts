import { useState } from 'react';

/** 초대 링크와 복사 상태. 링크 공유 화면과 친구 초대 시트가 같이 쓴다 */
export function useInviteLink(pastureId: string) {
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

    return { inviteUrl, copied, copyFailed, copyLink };
}
