import { AuthForm } from '@/features/auth/AuthForm';

/** `/login` 로그인. 토큰이 무효가 되면 API 클라이언트가 `?next=`를 붙여 이 화면으로 보낸다 */
export function LoginPage() {
    return <AuthForm mode="login" />;
}
