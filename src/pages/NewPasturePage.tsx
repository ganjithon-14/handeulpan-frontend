import { useState, type FormEvent } from 'react';

import { ApiError, ERROR_CODE } from '@/api/errors';
import { createPasture } from '@/api/pastures';
import { InviteShare } from '@/features/invite/InviteShare';
import {
    INITIAL_SHEEP_SETUP,
    isSheepSetupReady,
    type SheepSetup,
} from '@/features/sheepSetup/sheepSetup';
import { SheepSetupFields } from '@/features/sheepSetup/SheepSetupFields';
import { CountedInput, FieldLabel } from '@/shared/ui/Field';
import { PageHeader } from '@/shared/ui/PageHeader';
import { usePastureStore } from '@/stores/pastureStore';

/** Figma 글자 수. 서버는 0~20자라 그 안에 들어간다. 들판 상단에 이름이 나와서 필수로 받는다 */
const PASTURE_NAME_MAX = 12;

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
 * `/new` 들판 만들기 (Figma 9:64) → 초대 링크 공유 (Figma 67:2030).
 * 공유 화면은 따로 주소를 두지 않고 같은 페이지에서 바꿔 보여준다.
 */
export function NewPasturePage() {
    const setLastPastureId = usePastureStore((state) => state.setLastPastureId);

    const [name, setName] = useState('');
    const [sheep, setSheep] = useState<SheepSetup>(INITIAL_SHEEP_SETUP);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [createdId, setCreatedId] = useState<string | null>(null);

    if (createdId) return <InviteShare pastureId={createdId} />;

    const trimmedName = name.trim();
    const ready =
        trimmedName.length > 0 &&
        trimmedName.length <= PASTURE_NAME_MAX &&
        isSheepSetupReady(sheep);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        if (!ready) return;

        setSubmitting(true);
        setError(null);
        try {
            const { pastureId } = await createPasture({
                ...sheep,
                name: trimmedName,
                sheepName: sheep.sheepName.trim(),
            });
            // 공유 화면에서 앱을 닫아도 다음에 `/`로 오면 이 들판으로 간다
            setLastPastureId(pastureId);
            setCreatedId(pastureId);
        } catch (caught) {
            setError(errorText(caught));
            setSubmitting(false);
        }
    }

    return (
        <main className="mx-auto flex min-h-dvh max-w-[393px] flex-col bg-white px-6 pb-[max(env(safe-area-inset-bottom),12px)]">
            <PageHeader title="들판 만들기" fallback="/" />

            <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-1 flex-col">
                <div className="flex flex-col gap-[30px]">
                    <div className="flex flex-col gap-4">
                        <FieldLabel htmlFor="pasture-name">들판 이름</FieldLabel>
                        <CountedInput
                            id="pasture-name"
                            maxLength={PASTURE_NAME_MAX}
                            placeholder="예: 졸업해도 우리"
                            value={name}
                            onChange={setName}
                        />
                    </div>

                    <section className="flex flex-col gap-[30px]">
                        <FieldLabel>내 양 꾸미기</FieldLabel>
                        <SheepSetupFields value={sheep} onChange={setSheep} />
                    </section>
                </div>

                {error && (
                    <p role="alert" className="mt-6 text-sm text-red-700">
                        {error}
                    </p>
                )}

                {/* 내용이 길어 스크롤되므로 버튼 위에 여백을 둔다 */}
                <div className="mt-auto pt-8 pb-3">
                    <button
                        type="submit"
                        disabled={!ready || submitting}
                        className="h-14 w-full rounded-[14px] bg-primary text-base font-bold tracking-[-0.2px] text-white disabled:bg-primary-disabled"
                    >
                        {submitting ? '잠시만요…' : '들판 만들기'}
                    </button>
                </div>
            </form>
        </main>
    );
}
