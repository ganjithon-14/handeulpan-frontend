import { useState } from 'react';

import { rewindSheep } from '@/api/demo';
import { ERROR_CODE, toApiError } from '@/api/errors';
import type { Distance, PastureSheep } from '@/api/types';

/** 데모 키를 두는 곳. 번들에 넣지 않으려고 시연 기기에서 한 번 입력받아 둔다 */
const DEMO_KEY_STORAGE = 'handeulpan-demo-key';
const REWIND_DAYS = [1, 2, 4] as const;
const DISTANCE_LABEL: Record<Distance, string> = {
    CENTER: '함께 있는 중',
    WALK: '산책 중',
    EDGE: '멀어짐',
};

function readKey() {
    try {
        return localStorage.getItem(DEMO_KEY_STORAGE) ?? '';
    } catch {
        return '';
    }
}

function saveKey(key: string) {
    try {
        localStorage.setItem(DEMO_KEY_STORAGE, key);
    } catch {
        // 저장이 막힌 브라우저(사생활 보호 모드 등): 이번 화면에서만 쓴다
    }
}

/**
 * 데모 패널 (`?demo=1`): 시연에서 "며칠 지나면 멀어진다"를 몇 초 만에 보여준다.
 * 되감기는 누적된다 (+1일 두 번 = 2일). 되돌리려면 그 양의 주인이 쓰다듬으면 된다.
 * 결과 거리는 onRewound로 넘겨 들판에 바로 반영한다. Figma 디자인이 없어 단순하게 둔다.
 */
export function DemoPanel({
    sheep,
    onRewound,
}: {
    sheep: PastureSheep[];
    onRewound: (sheepId: number, distance: Distance) => void;
}) {
    const [demoKey, setDemoKey] = useState(readKey);
    const [pending, setPending] = useState<number | null>(null);
    const [error, setError] = useState('');

    async function rewind(sheepId: number, days: number) {
        setPending(sheepId);
        setError('');
        try {
            const { distance } = await rewindSheep(sheepId, days, demoKey.trim());
            onRewound(sheepId, distance);
        } catch (caught) {
            const { code } = toApiError(caught);
            setError(
                code === ERROR_CODE.INVALID_DEMO_KEY
                    ? '데모 키를 확인해 주세요.'
                    : '되감지 못했어요. 잠시 후 다시 시도해 주세요.',
            );
        } finally {
            setPending(null);
        }
    }

    return (
        // 탭바 위에 떠 있게 둔다. 접어 두면 들판을 가리지 않는다
        <details
            open
            className="fixed inset-x-0 bottom-[calc(max(env(safe-area-inset-bottom),48px)+84px)] mx-auto w-[calc(100%-48px)] max-w-[345px] rounded-2xl bg-black/75 px-4 py-3 text-xs text-white"
        >
            <summary className="cursor-pointer font-semibold">데모</summary>

            <label className="mt-2 flex items-center gap-2">
                <span className="shrink-0">키</span>
                <input
                    value={demoKey}
                    onChange={(event) => {
                        setDemoKey(event.target.value);
                        saveKey(event.target.value);
                    }}
                    autoComplete="off"
                    className="min-w-0 flex-1 rounded-md bg-white/15 px-2 py-1 outline-none"
                />
            </label>

            <ul className="mt-2 flex flex-col gap-1.5">
                {sheep.map(({ id, name, distance }) => (
                    <li key={id} className="flex items-center gap-1.5">
                        <span className="min-w-0 flex-1 truncate">
                            {name} · {DISTANCE_LABEL[distance]}
                        </span>
                        {REWIND_DAYS.map((days) => (
                            <button
                                key={days}
                                type="button"
                                disabled={pending !== null || !demoKey.trim()}
                                onClick={() => rewind(id, days)}
                                className="rounded-md bg-white/20 px-2 py-1 disabled:opacity-40"
                            >
                                +{days}일
                            </button>
                        ))}
                    </li>
                ))}
            </ul>

            {error && (
                <p role="alert" className="mt-2 text-[#ffb4a8]">
                    {error}
                </p>
            )}
        </details>
    );
}
