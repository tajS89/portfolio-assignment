import { Login } from './components/login/Login';
import { Dashboard } from './components/dashboard/Dashboard';
import { useAuth } from './hooks/useAuth';

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        Loading…
      </div>
    );
  }

  return isAuthenticated ? (
    <Dashboard />
  ) : (
    <Login />
  )
}
