import { AuthForm } from '@/features/auth/AuthForm';

/** `/signup` 가입: 이메일·비밀번호. 양 이름은 들판 만들기·합류 때 받는다 */
export function SignupPage() {
    return <AuthForm mode="signup" />;
}
