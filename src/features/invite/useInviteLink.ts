import { useRef, useState } from 'react';

/** 복사 결과 안내를 띄워 두는 시간 */
const NOTICE_MS = 2500;

/**
 * 초대 링크와 복사 상태. 링크 공유 화면과 친구 초대 시트가 같이 쓴다.
 * - notice: 잠깐 띄웠다 사라지는 안내 ('copied' | 'failed')
 * - copyFailed: 한 번이라도 실패했는지. 공유 화면은 이걸 보고 링크를 계속 보여준다
 */
export function useInviteLink(pastureId: string) {
    const inviteUrl = `${window.location.origin}/p/${pastureId}`;
    const [notice, setNotice] = useState<'copied' | 'failed' | null>(null);
    const [copyFailed, setCopyFailed] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

    function flash(next: 'copied' | 'failed') {
        clearTimeout(timer.current);
        setNotice(next);
        timer.current = setTimeout(() => setNotice(null), NOTICE_MS);
    }

    async function copyLink() {
        try {
            // http 주소(폰으로 연 개발 서버 등)에서는 navigator.clipboard가 없어서 여기서 throw된다
            await navigator.clipboard.writeText(inviteUrl);
            flash('copied');
        } catch {
            setCopyFailed(true);
            flash('failed');
        }
    }

    return { inviteUrl, copied: notice === 'copied', notice, copyFailed, copyLink };
}
