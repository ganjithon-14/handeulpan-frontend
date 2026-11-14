import { useNavigate } from 'react-router';

/**
 * Figma '들판 만들기' 헤더: 뒤로 가기 + 가운데 제목.
 * title이 없으면 뒤로 가기만 그린다 (초대 랜딩·합류).
 * fallback: 링크로 바로 들어와서 앞 화면이 없을 때 갈 경로
 */
export function PageHeader({ title, fallback }: { title?: string; fallback: string }) {
    const navigate = useNavigate();

    // 앞 화면이 있으면 그리로, 없으면 fallback으로.
    // react-router가 history.state.idx에 이 앱 안에서 몇 번째 화면인지 적어 둔다.
    function goBack() {
        const index = (window.history.state as { idx?: number } | null)?.idx ?? 0;
        if (index > 0) navigate(-1);
        else navigate(fallback, { replace: true });
    }

    return (
        <header className="relative mt-5 flex h-14 items-center justify-center">
            <button
                type="button"
                onClick={goBack}
                aria-label="뒤로 가기"
                className="absolute left-[-17px] flex size-11 items-center justify-center"
            >
                <img src="/assets/icon-back.svg" alt="" width={10} height={18} />
            </button>
            {title && <h1 className="text-xl leading-7 font-semibold text-black">{title}</h1>}
        </header>
    );
}
