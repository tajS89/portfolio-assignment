// Shared auth types (API contracts between frontend and backend)
export interface LoginRequest {
    username: string;
    password: string;
}

export type LoginResponse =
    | { success: true, token: string }
    | { success: false, message: string }
