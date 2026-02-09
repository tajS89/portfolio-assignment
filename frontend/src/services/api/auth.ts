import type { LoginResponse } from "@shared/types/auth";
import { API_BASE_URL } from "../../constants/api";

export async function loginRequest(username: string, password: string): Promise<LoginResponse> {
    const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    const data: LoginResponse = await res.json();
    return data;
}
