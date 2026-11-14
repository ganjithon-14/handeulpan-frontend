import type { WoolColor } from '@/api/types';

/** Figma 글자 수. 서버는 1~10자라 그 안에 들어간다 */
export const SHEEP_NAME_MAX = 8;

export interface SheepSetup {
    sheepName: string;
    woolColor: WoolColor;
    agreed: boolean;
}

export const INITIAL_SHEEP_SETUP: SheepSetup = { sheepName: '', woolColor: 'CREAM', agreed: false };

/** 서버에 보내도 되는지. 동의는 API가 true를 요구한다 */
export function isSheepSetupReady({ sheepName, agreed }: SheepSetup) {
    const name = sheepName.trim();
    return name.length > 0 && name.length <= SHEEP_NAME_MAX && agreed;
}
