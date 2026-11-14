import { useEffect, useState, type FormEvent } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router';

import { ApiError, ERROR_CODE, toApiError } from '@/api/errors';
import { getPasturePreview, joinPasture } from '@/api/pastures';
import type { PasturePreview } from '@/api/types';
import {
    INITIAL_SHEEP_SETUP,
    isSheepSetupReady,
    type SheepSetup,
} from '@/features/sheepSetup/sheepSetup';
import { SheepSetupFields } from '@/features/sheepSetup/SheepSetupFields';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { PageHeader } from '@/shared/ui/PageHeader';
import { usePastureStore } from '@/stores/pastureStore';

/** 서버 에러를 화면 문구로. message가 아니라 code로 나눈다 */
function errorText(error: unknown): string {
    if (!(error instanceof ApiError)) return '잠시 후 다시 시도해 주세요.';
    switch (error.code) {
        case ERROR_CODE.VALIDATION_FAILED:
            return '입력한 내용을 다시 확인해 주세요.';
        case ERROR_CODE.NETWORK_ERROR:
            return '네트워크 연결을 확인해 주세요.';
        default:
            return '잠시 후 다시 시도해 주세요.';
    }
}

/**
 * `/p/:pastureId/join` 합류: 양 만들기 (Figma 130:5307).
 * 들판 이름은 미리보기 API에서 받는다. 가득 찼거나 이미 합류했으면 `/p/:pastureId`로 보내
 * 그쪽 화면(가득 참 랜딩 / 들판)이 상황을 보여주게 한다.
 */
export function JoinPage() {
    const { pastureId = '' } = useParams();
    const navigate = useNavigate();
    const setLastPastureId = usePastureStore((state) => state.setLastPastureId);

    const [preview, setPreview] = useState<PasturePreview | null>(null);
    const [previewError, setPreviewError] = useState<string | null>(null);
    const [sheep, setSheep] = useState<SheepSetup>(INITIAL_SHEEP_SETUP);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        getPasturePreview(pastureId)
            .then(setPreview)
            .catch((caught) => setPreviewError(toApiError(caught).code));
    }, [pastureId]);

    if (previewError === ERROR_CODE.PASTURE_NOT_FOUND) return <NotFoundPage />;
    if (preview?.full) return <Navigate to={`/p/${pastureId}`} replace />;

    const ready = isSheepSetupReady(sheep);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        if (!ready) return;

        setSubmitting(true);
        setError(null);
        try {
            await joinPasture(pastureId, { ...sheep, sheepName: sheep.sheepName.trim() });
            setLastPastureId(pastureId);
            navigate(`/p/${pastureId}`, { replace: true });
        } catch (caught) {
            const { code } = toApiError(caught);
            if (code === ERROR_CODE.ALREADY_JOINED || code === ERROR_CODE.PASTURE_FULL) {
                navigate(`/p/${pastureId}`, { replace: true });
                return;
            }
            setError(errorText(caught));
            setSubmitting(false);
        }
    }

    return (
        <main className="mx-auto flex min-h-dvh max-w-[393px] flex-col bg-white px-6 pb-[max(env(safe-area-inset-bottom),12px)]">
            <PageHeader fallback={`/p/${pastureId}`} />

            <div className="mt-4 min-h-[89px]">
                <p className="font-batang text-base leading-7 font-bold text-leaf">
                    {preview?.name}
                </p>
                <h1 className="font-dodum text-xl leading-[35px] tracking-[1px] text-black">
                    들판에서 지낼
                    <br />
                    나의 양을 만들어봐요
                </h1>
            </div>

            <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-1 flex-col">
                <SheepSetupFields value={sheep} onChange={setSheep} />

                {(error || previewError) && (
                    <p role="alert" className="mt-6 text-sm text-red-700">
                        {error ?? '들판을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.'}
                    </p>
                )}

                <div className="mt-auto pt-8 pb-3">
                    <button
                        type="submit"
                        disabled={!ready || submitting}
                        className="h-14 w-full rounded-[14px] bg-primary text-base font-bold tracking-[-0.2px] text-white disabled:bg-primary-disabled"
                    >
                        {submitting ? '잠시만요…' : '내 양 풀어놓기'}
                    </button>
                </div>
            </form>
        </main>
    );
}
