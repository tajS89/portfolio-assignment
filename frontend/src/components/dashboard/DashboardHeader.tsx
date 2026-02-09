import { ThemeToggle } from './ThemeToggle';

interface Props {
    onLogout: () => void;
}

export function DashboardHeader({ onLogout }: Props) {
    return (
        <header className="bg-white border-b relative z-40" data-testid="dashboard-header">
            <div className="w-full px-2 xs:px-4 sm:px-6 lg:px-8 py-2 xs:py-4 flex flex-wrap justify-between items-center gap-1.5 xs:gap-3 sm:gap-4">
                <h1 className="text-base xs:text-lg sm:text-2xl font-bold truncate" data-testid="dashboard-title">Portfolio Dashboard</h1>
                <div className="flex items-center gap-1 xs:gap-2 sm:gap-4 flex-shrink-0">
                    <ThemeToggle />
                    <button onClick={onLogout} type="button" className="text-xs font-medium whitespace-nowrap hover:text-gray-600 transition-colors px-1.5 xs:px-2" data-testid="logout-button">
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
}
