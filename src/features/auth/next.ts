/**
 * 로그인·가입 뒤 돌아갈 경로(`?next=`)를 읽는다.
 * 우리 앱 안의 경로(`/`로 시작, `//`·`/\`는 아님)만 따른다. 바깥 사이트로 튕겨 나가는 걸 막기 위해서다.
 * `/\`도 막는 이유: 브라우저가 `\`를 `/`로 읽어 `/\evil.com`을 다른 사이트 주소로 해석한다.
 */
export function readNext(search: string): string | null {
    const next = new URLSearchParams(search).get('next');
    if (!next || !next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) {
        return null;
    }
    return next;
}

/** 지금 주소를 `?next=` 값으로 만든다 */
export function nextQuery(pathname: string, search: string): string {
    return `?next=${encodeURIComponent(pathname + search)}`;
}
