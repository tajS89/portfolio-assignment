import { useState, type FormEvent } from "react";
import { useAuth } from "../../hooks/useAuth";

export function LoginForm() {
    const { login } = useAuth();

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [errors, setErrors] = useState<{ username?: string; password?: string; form?: string }>({});

    const validate = () => {
        const newErrors: { username?: string; password?: string } = {};

        if (!username.trim()) {
            newErrors.username = "Username is required";
        }

        if (!password.trim()) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validate()) return;

        setIsLoading(true);
        setErrors({});

        try {
            await login(username.trim(), password);
        } catch (err) {
            setErrors({
                form: err instanceof Error ? err.message : "Login failed",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit} data-testid="login-form">
            <div>
                <label
                    htmlFor="login-username"
                    className="block text-sm font-medium mb-2"
                    data-testid="username-label"
                >
                    Username
                </label>
                <input
                    id="login-username"
                    data-testid="username-input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="demo"
                    disabled={isLoading}
                    aria-invalid={!!errors.username}
                    aria-describedby={errors.username ? "username-error" : undefined}
                />
                {errors.username && (
                    <p className="text-red-600 text-sm mt-1" id="username-error" role="alert" data-testid="username-error">{errors.username}</p>
                )}
            </div>

            <div>
                <label
                    htmlFor="login-password"
                    className="block text-sm font-medium mb-2"
                    data-testid="password-label"
                >
                    Password
                </label>
                <input
                    id="login-password"
                    data-testid="password-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="demo"
                    disabled={isLoading}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-error" : undefined}
                />
                {errors.password && (
                    <p className="text-red-600 text-sm mt-1" id="password-error" role="alert" data-testid="password-error">{errors.password}</p>
                )}
            </div>

            {errors.form && (
                <div
                    className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm"
                    role="alert"
                    aria-live="polite"
                    data-testid="login-error-message"
                >
                    {errors.form}
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading}
                aria-busy={isLoading}
                data-testid="login-submit-button"
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50"
            >
                {isLoading ? "Signing in…" : "Sign In"}
            </button>

            <p className="text-sm text-gray-500 text-center">
                Demo credentials: <strong>test / Password1_</strong>
            </p>
        </form>
    );
}