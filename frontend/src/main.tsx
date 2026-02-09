import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthProvider';
import { ThemeProvider } from './context/ThemeProvider';
import { ErrorBoundary } from './components/error';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </ErrorBoundary>

);