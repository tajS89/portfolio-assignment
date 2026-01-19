import { TOKEN_KEY } from '../../constants/auth';

export const getAuthToken = (): string | null => {
    try {
        return localStorage.getItem(TOKEN_KEY);
    } catch (error) {
        console.error("Failed to get auth token:", error);
        return null;
    }
};

export const setAuthToken = (token: string): void => {
    try {
        localStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
        console.error("Failed to set auth token:", error);
    }
};

export const removeAuthToken = (): void => {
    try {
        localStorage.removeItem(TOKEN_KEY);
    } catch (error) {
        console.error("Failed to remove auth token:", error);
    }
};
