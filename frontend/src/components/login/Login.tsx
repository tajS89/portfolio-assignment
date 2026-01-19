import { LoginHeader } from './LoginHeader';
import { LoginForm } from './LoginForm';

export function Login() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"
            data-testid="login">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                <LoginHeader />
                <LoginForm />
            </div>
        </main>
    );
}
