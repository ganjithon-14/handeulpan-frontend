import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';

import { login, signup } from '@/api/auth';
import { ApiError, ERROR_CODE } from '@/api/errors';
import { readNext } from '@/features/auth/next';
import { useAuthStore } from '@/stores/authStore';

type AuthMode = 'signup' | 'login';

// 백엔드 auth.md 규칙과 같게 맞춘다. 서버도 검사하지만 먼저 알려주면 한 번 덜 기다린다.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 공백 없는 영문·숫자·특수문자 = 공백을 뺀 출력 가능한 ASCII(`!`~`~`), 8~72자. 한글은 여기서 걸린다.
const PASSWORD_PATTERN = /^[\x21-\x7E]{8,72}$/;

const COPY = {
    signup: {
        title: '가입하기',
        submit: '가입하고 시작하기',
        switchText: '이미 계정이 있어요',
        switchLabel: '로그인',
        switchPath: '/login',
    },
    login: {
        title: '로그인',
        submit: '로그인',
        switchText: '처음 오셨나요?',
        switchLabel: '가입하기',
        switchPath: '/signup',
    },
} as const;

/** 클라이언트 검사. 문제가 없으면 null */
function validate(mode: AuthMode, email: string, password: string): string | null {
    if (!EMAIL_PATTERN.test(email) || email.length > 100) return '이메일 형식을 확인해 주세요.';
    // 로그인은 예전 규칙으로 만든 계정이 있을 수 있어 비어 있는지만 본다
    if (mode === 'login') return password ? null : '비밀번호를 입력해 주세요.';
    if (!PASSWORD_PATTERN.test(password)) {
        return '비밀번호는 공백 없이 영문·숫자·특수문자 8~72자로 입력해 주세요.';
    }
    return null;
}

/** 서버 에러를 화면 문구로. message가 아니라 code로 나눈다 */
function errorText(error: unknown): string {
    if (!(error instanceof ApiError)) return '잠시 후 다시 시도해 주세요.';
    switch (error.code) {
        case ERROR_CODE.DUPLICATE_EMAIL:
            return '이미 가입된 이메일이에요. 로그인해 주세요.';
        case ERROR_CODE.INVALID_CREDENTIALS:
            // 이메일·비밀번호 중 무엇이 틀렸는지는 알려주지 않는다 (서버 정책)
            return '이메일 또는 비밀번호가 맞지 않아요.';
        case ERROR_CODE.VALIDATION_FAILED:
            return '입력한 내용을 다시 확인해 주세요.';
        case ERROR_CODE.NETWORK_ERROR:
            return '네트워크 연결을 확인해 주세요.';
        default:
            return '잠시 후 다시 시도해 주세요.';
    }
}

/**
 * 가입·로그인 공용 폼. 칸이 같아서(이메일·비밀번호) 하나로 쓰고 문구와 API만 바꾼다.
 * 성공하면 토큰을 저장하고 `?next=` 경로로, 없으면 `/`(첫 진입 분기)로 보낸다.
 */
export function AuthForm({ mode }: { mode: AuthMode }) {
    const navigate = useNavigate();
    const { search } = useLocation();
    const setToken = useAuthStore((state) => state.setToken);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const copy = COPY[mode];

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        const trimmedEmail = email.trim();
        const invalid = validate(mode, trimmedEmail, password);
        if (invalid) {
            setError(invalid);
            return;
        }

        setSubmitting(true);
        setError(null);
        try {
            const request = mode === 'signup' ? signup : login;
            const { deviceToken } = await request({ email: trimmedEmail, password });
            setToken(deviceToken);
            navigate(readNext(search) ?? '/', { replace: true });
        } catch (caught) {
            setError(errorText(caught));
            setSubmitting(false);
        }
    }

    return (
        <main className="mx-auto flex min-h-dvh max-w-[393px] flex-col bg-cream px-6 pt-20 pb-10">
            <h1 className="font-batang text-2xl font-bold text-primary">{copy.title}</h1>

            <form onSubmit={handleSubmit} noValidate className="mt-10 flex flex-1 flex-col gap-4">
                <label className="flex flex-col gap-2 text-sm text-primary">
                    이메일
                    <input
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="rounded-xl border border-primary/20 bg-white px-4 py-3 text-base outline-none focus:border-primary"
                    />
                </label>
                <label className="flex flex-col gap-2 text-sm text-primary">
                    비밀번호
                    {/* 보기 버튼: 한글 자판으로 잘못 친 걸 확인할 수 있게. 비밀번호 찾기가 없어서 특히 중요하다 */}
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className="w-full rounded-xl border border-primary/20 bg-white py-3 pr-16 pl-4 text-base outline-none focus:border-primary"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((shown) => !shown)}
                            aria-pressed={showPassword}
                            className="absolute inset-y-0 right-0 px-4 text-sm text-primary"
                        >
                            {showPassword ? '숨기기' : '보기'}
                        </button>
                    </div>
                </label>
                {mode === 'signup' && (
                    <p className="text-xs text-primary/60">
                        비밀번호를 잊으면 찾을 수 없어요. 꼭 기억해 주세요.
                    </p>
                )}

                {error && (
                    <p role="alert" className="text-sm text-red-700">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={submitting}
                    className="mt-auto rounded-xl bg-primary py-4 font-bold text-white disabled:opacity-50"
                >
                    {submitting ? '잠시만요…' : copy.submit}
                </button>
            </form>

            <p className="mt-4 text-center text-sm text-primary/70">
                {copy.switchText} {/* 오가는 동안에도 돌아갈 경로(next)를 유지한다 */}
                <Link to={copy.switchPath + search} replace className="font-bold underline">
                    {copy.switchLabel}
                </Link>
            </p>
        </main>
    );
}
