import { useCopy } from '@/shared/useCopy';

/** 초대 링크와 복사 상태. 링크 공유 화면과 친구 초대 시트가 같이 쓴다. */
export function useInviteLink(pastureId: string) {
    const inviteUrl = `${window.location.origin}/p/${pastureId}`;
    const { notice, copyFailed, copy } = useCopy();

    return {
        inviteUrl,
        copied: notice === 'copied',
        notice,
        copyFailed,
        copyLink: () => copy(inviteUrl),
    };
}
