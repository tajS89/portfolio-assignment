export function LoginHeader() {
    return (
        <header className="text-center mb-8" data-testid="login-header" >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4" aria-label="Portfolio icon">
                <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                >                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900" data-testid="login-header-title">Portfolio Manager</h1>
            <p className="text-gray-600 mt-2" data-testid="login-header-name">Sign in to view your dashboard</p>
        </header>
    );
}
