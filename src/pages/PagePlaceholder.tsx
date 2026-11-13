import type { ReactNode } from 'react';

interface PagePlaceholderProps {
    title: string;
    children?: ReactNode;
}

/**
 * 화면을 만들기 전까지 라우트가 잘 연결됐는지 보여주는 임시 화면.
 * 4번 이슈부터 각 화면을 구현하면서 하나씩 지운다.
 */
export function PagePlaceholder({ title, children }: PagePlaceholderProps) {
    return (
        <main className="flex min-h-dvh flex-col items-center justify-center gap-2 bg-cream">
            <h1 className="font-batang text-2xl font-bold text-primary">{title}</h1>
            {children}
        </main>
    );
}
