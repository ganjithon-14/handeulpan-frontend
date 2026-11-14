import { useEffect, useRef, type ReactNode } from 'react';

/**
 * 아래에서 올라오는 시트 (Figma '나의 들판'·'친구 초대하기' 시트 공통 틀).
 * <dialog>의 showModal을 써서 Esc 닫기, 뒤 화면 막기, 포커스 가두기를 브라우저에 맡긴다.
 * 어두운 배경을 누르면 닫힌다.
 */
export function BottomSheet({
    open,
    onClose,
    label,
    children,
}: {
    open: boolean;
    onClose: () => void;
    /** 화면 읽기용 시트 이름 */
    label: string;
    children: ReactNode;
}) {
    const ref = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = ref.current;
        if (!dialog) return;
        if (open && !dialog.open) dialog.showModal();
        if (!open && dialog.open) dialog.close();
    }, [open]);

    return (
        <dialog
            ref={ref}
            aria-label={label}
            onClose={onClose}
            // 안쪽 내용은 div가 덮고 있어서, dialog 자신이 눌렸다면 배경을 누른 것이다
            onClick={(event) => event.target === event.currentTarget && onClose()}
            className="m-0 mx-auto mt-auto w-full max-w-[393px] rounded-t-xl bg-[#fffcf4] backdrop:bg-black/30 backdrop:backdrop-blur-[2px]"
        >
            <div className="relative px-[21px] pt-8 pb-[max(env(safe-area-inset-bottom),34px)]">
                <span
                    aria-hidden
                    className="absolute top-2.5 left-1/2 h-[5px] w-16 -translate-x-1/2 rounded-[10px] bg-[#ebecee]"
                />
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="닫기"
                        className="flex size-6 items-center justify-center"
                    >
                        <img src="/assets/icon-close.svg" alt="" width={13.5} height={13.5} />
                    </button>
                </div>
                {children}
            </div>
        </dialog>
    );
}
