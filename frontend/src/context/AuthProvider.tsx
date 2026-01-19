import {
    useState,
    useEffect,
    useCallback,
    useRef,
    type ReactNode,
} from "react";
import type { AuthContextValue } from "../types";
import { AuthContext } from "./AuthContext";
import { loginRequest } from "../services/api";
import { getAuthToken, setAuthToken, removeAuthToken } from "../services/storage";
import { API_BASE_URL } from "../constants";

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [token, setToken] = useState<string | null>(getAuthToken());
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const firstRun = useRef(true);

    const logout = useCallback(() => {
        removeAuthToken();
        setToken(null);
        setIsAuthenticated(false);
    }, []);

    const login = useCallback(async (username: string, password: string) => {
        const response = await loginRequest(username, password);

        if (!response.success || !('token' in response)) {
            throw new Error(response.success === false ? response.message : 'Invalid credentials. Please try again.');
        }

        setAuthToken(response.token);
        setToken(response.token);
        setIsAuthenticated(true);
        setIsLoading(false);
        firstRun.current = false;
    }, []);

    useEffect(() => {
        if (firstRun.current) {
            firstRun.current = false;

            if (!token) {
                setIsLoading(false);
                return;
            }
        } else {
            if (isAuthenticated) {
                return;
            }
        }

        const validate = async () => {
            if (!token) {
                setIsLoading(false);
                setIsAuthenticated(false);
                return;
            }

            try {
                const res = await fetch(`${API_BASE_URL}/auth/validate`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) throw new Error("Invalid token");

                setIsAuthenticated(true);
            } catch (err) {
                console.error(err);
                logout();
            } finally {
                setIsLoading(false);
            }
        };

        validate();
    }, [token, isAuthenticated, logout]);

    const value: AuthContextValue = {
        token,
        login,
        logout,
        isLoading,
        isAuthenticated,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}