import { useState } from 'react';

/**
 * 시트 안 빈자리(30px)에 잠깐 뜨는 안내 글. 기준 칸(relative)의 위쪽에 absolute로 붙고,
 * below면 아래쪽(시트 아래 여백 34px 안)에 붙는다. 떴다 사라져도 시트 높이가 바뀌지 않는다.
 * text가 null이 되면 서서히 사라지고, 사라지는 동안에는 마지막 문구를 그대로 보여준다.
 */
export function SheetNotice({ text, below = false }: { text: string | null; below?: boolean }) {
    const [lastText, setLastText] = useState(text);
    if (text && text !== lastText) setLastText(text);

    return (
        <p
            role="status"
            className={`pointer-events-none absolute inset-x-0 ${below ? 'top-full' : 'bottom-full'} flex h-[30px] items-center justify-center text-center text-xs text-primary transition-opacity duration-300 ${text ? 'opacity-100' : 'opacity-0'}`}
        >
            {lastText}
        </p>
    );
}
