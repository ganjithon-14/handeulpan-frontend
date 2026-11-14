import { useRef, useState } from 'react';

/** 복사 결과 안내를 띄워 두는 시간 */
const NOTICE_MS = 2500;

/**
 * 클립보드 복사와 그 결과 안내. 초대 링크·안부 문장 복사가 같이 쓴다.
 * - notice: 잠깐 띄웠다 사라지는 안내 ('copied' | 'failed')
 * - copyFailed: 한 번이라도 실패했는지. 실패하면 직접 복사할 수 있게 글을 계속 보여주는 데 쓴다
 */
export function useCopy() {
    const [notice, setNotice] = useState<'copied' | 'failed' | null>(null);
    const [copyFailed, setCopyFailed] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

    function flash(next: 'copied' | 'failed') {
        clearTimeout(timer.current);
        setNotice(next);
        timer.current = setTimeout(() => setNotice(null), NOTICE_MS);
    }

    async function copy(text: string) {
        try {
            // http 주소(폰으로 연 개발 서버 등)에서는 navigator.clipboard가 없어서 여기서 throw된다
            await navigator.clipboard.writeText(text);
            flash('copied');
        } catch {
            setCopyFailed(true);
            flash('failed');
        }
    }

    return { notice, copyFailed, copy };
}
