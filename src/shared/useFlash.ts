import { useRef, useState } from 'react';

/** 안내를 띄워 두는 시간 */
const NOTICE_MS = 2500;

/** 잠깐 띄웠다 사라지는 안내. 연달아 띄우면 마지막 것이 처음부터 다시 보인다 */
export function useFlash<T>() {
    const [notice, setNotice] = useState<T | null>(null);
    const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

    function flash(next: T) {
        clearTimeout(timer.current);
        setNotice(next);
        timer.current = setTimeout(() => setNotice(null), NOTICE_MS);
    }

    return { notice, flash };
}
