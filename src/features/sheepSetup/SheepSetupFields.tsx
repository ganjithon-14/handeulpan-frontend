import { WOOL_COLORS, type WoolColor } from '@/api/types';
import { SHEEP_NAME_MAX, type SheepSetup } from '@/features/sheepSetup/sheepSetup';
import { CountedInput } from '@/shared/ui/Field';

// Figma 버튼 이름(포근한 크림…)을 화면 읽기용 이름으로 쓴다
const WOOL_LABEL: Record<WoolColor, string> = {
    CREAM: '포근한 크림',
    PINK: '다정한 분홍',
    YELLOW: '햇살 노랑',
    MINT: '산뜻한 민트',
    SKY: '맑은 하늘',
    LAVENDER: '고요한 라벤더',
};
// Tailwind는 클래스 이름을 통째로 찾으므로 `bg-wool-${...}`로 조립하지 않는다
const WOOL_SWATCH: Record<WoolColor, string> = {
    CREAM: 'bg-wool-cream',
    PINK: 'bg-wool-pink',
    YELLOW: 'bg-wool-yellow',
    MINT: 'bg-wool-mint',
    SKY: 'bg-wool-sky',
    LAVENDER: 'bg-wool-lavender',
};

/**
 * 양 꾸미기: 미리보기 + 양 이름 + 털 색 + 동의 카드.
 * 들판 만들기(Figma 9:64)와 합류(Figma 130:5307)가 같은 묶음을 쓴다.
 * Figma 들판 만들기에는 동의 카드가 없지만 API가 `agreed: true`를 요구해서 합류 화면 것을 가져왔다.
 */
export function SheepSetupFields({
    value,
    onChange,
}: {
    value: SheepSetup;
    onChange: (next: SheepSetup) => void;
}) {
    const { sheepName, woolColor, agreed } = value;

    return (
        <div className="flex flex-col items-center gap-[30px]">
            <img
                src={`/assets/sheep-${woolColor.toLowerCase()}.webp`}
                alt={`${WOOL_LABEL[woolColor]} 털의 양`}
                width={160}
                height={156}
                className="h-[156px] w-40 object-contain"
            />

            <div className="flex w-full flex-col gap-5">
                <div className="flex flex-col gap-4">
                    <label htmlFor="sheep-name" className="text-sm leading-none font-medium">
                        양 이름
                    </label>
                    <CountedInput
                        id="sheep-name"
                        maxLength={SHEEP_NAME_MAX}
                        value={sheepName}
                        onChange={(next) => onChange({ ...value, sheepName: next })}
                    />
                </div>

                <div className="flex flex-col gap-4">
                    <p id="wool-color-label" className="text-sm leading-none font-medium">
                        털 색 고르기
                    </p>
                    {/* 진짜 radio를 숨겨 두고 동그라미를 그린다: 키보드·화면 읽기가 그대로 동작한다 */}
                    <div
                        role="radiogroup"
                        aria-labelledby="wool-color-label"
                        className="flex justify-between pt-2.5"
                    >
                        {WOOL_COLORS.map((color) => {
                            const selected = color === woolColor;
                            return (
                                <label
                                    key={color}
                                    className={`relative grid size-[46px] place-items-center rounded-full border has-focus-visible:outline-2 has-focus-visible:outline-primary ${selected ? 'border-primary' : 'border-transparent'}`}
                                >
                                    <input
                                        type="radio"
                                        name="woolColor"
                                        value={color}
                                        checked={selected}
                                        onChange={() => onChange({ ...value, woolColor: color })}
                                        aria-label={WOOL_LABEL[color]}
                                        className="sr-only"
                                    />
                                    <span
                                        className={`size-[34px] rounded-full border border-[#4b443a1f] ${WOOL_SWATCH[color]}`}
                                    />
                                    {selected && (
                                        <img
                                            src="/assets/icon-check.svg"
                                            alt=""
                                            width={15}
                                            height={15}
                                            className="absolute"
                                        />
                                    )}
                                </label>
                            );
                        })}
                    </div>
                </div>
            </div>

            <label className="flex w-full gap-[11px] rounded-2xl border border-line bg-cream p-[13px] has-focus-visible:outline-2 has-focus-visible:outline-primary">
                <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(event) => onChange({ ...value, agreed: event.target.checked })}
                    className="sr-only"
                />
                {/* Figma에 체크된 모습이 없어 털 색 선택과 같은 갈색 체크를 쓴다 */}
                <span className="grid size-[22px] shrink-0 place-items-center rounded-[7px] border border-line bg-cream">
                    {agreed && <img src="/assets/icon-check.svg" alt="" width={15} height={15} />}
                </span>
                <span className="flex flex-col gap-[5px]">
                    <span className="text-xs leading-[16.5px] font-semibold text-black">
                        서로의 안부를 살피는 것에 동의해요
                    </span>
                    <span className="text-[10px] leading-[14px] text-subtle">
                        내 양이 멀어지면 이 들판 친구들이 알 수 있어요.
                    </span>
                </span>
            </label>
        </div>
    );
}
