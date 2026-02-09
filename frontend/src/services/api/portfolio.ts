import type { PortfolioResponse } from "@shared/types/portfolio";
import { API_BASE_URL } from "../../constants/api";
import { getAuthToken } from "../storage/authStorage";

export async function getDashboardData(): Promise<PortfolioResponse> {
    const token = getAuthToken();
    try {
        const res = await fetch(`${API_BASE_URL}/portfolio`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        });

        if (!res.ok) {
            let errorMessage = `HTTP error! Status: ${res.status}`;

            try {
                const errorData = await res.json();
                errorMessage = errorData.message || errorData.error || errorMessage;
            } catch {
                errorMessage = res.statusText || errorMessage;
            }

            throw new Error(errorMessage);
        }

        const data: PortfolioResponse = await res.json();
        return data;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Failed to fetch dashboard data:', error.message);
            throw error;
        }
        const unknownError = new Error('An unexpected error occurred while fetching dashboard data');
        console.error(unknownError);
        throw unknownError;
    }
}
