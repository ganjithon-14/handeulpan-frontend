// Figma '들판 만들기' 입력칸: 크림 배경, 연갈색 테두리, 모서리 15, 높이 55
export const INPUT_BOX =
    'flex items-center rounded-[15px] border border-line bg-cream px-[15px] focus-within:border-primary';
// 글자는 16px: 14px(Figma)면 iOS Safari가 칸을 누를 때 화면을 확대해 버린다. 안내문만 Figma대로 14px
export const INPUT =
    'h-[55px] w-full min-w-0 bg-transparent font-dodum text-base outline-none placeholder:text-sm placeholder:text-placeholder';

/**
 * Figma '로고+텍스트': 꽃 아이콘 + 칸 이름.
 * 입력칸 이름이면 htmlFor를 주고, '내 양 꾸미기'처럼 묶음 제목이면 빼서 제목(h2)으로 쓴다.
 */
export function FieldLabel({ htmlFor, children }: { htmlFor?: string; children: string }) {
    const Tag = htmlFor ? 'label' : 'h2';
    return (
        <Tag
            htmlFor={htmlFor}
            className="flex items-center gap-1.5 text-base leading-none font-medium text-black"
        >
            <img src="/assets/icon-flower.webp" alt="" className="size-[18px]" />
            {children}
        </Tag>
    );
}

interface CountedInputProps {
    id: string;
    value: string;
    onChange: (value: string) => void;
    maxLength: number;
    placeholder?: string;
}

/** 오른쪽에 글자 수(`0/12`)가 붙은 입력칸 (들판 이름, 양 이름) */
export function CountedInput({ id, value, onChange, maxLength, placeholder }: CountedInputProps) {
    return (
        <div className={INPUT_BOX}>
            <input
                id={id}
                type="text"
                maxLength={maxLength}
                placeholder={placeholder}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className={INPUT}
            />
            <span className="ml-2 shrink-0 font-dodum text-[10px] leading-[15px] text-counter">
                {value.length}/{maxLength}
            </span>
        </div>
    );
}
