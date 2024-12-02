import { useState } from "react"
import { ILoginRequest, IRegisterRequest } from "../api/types";
import { authService } from "../api/services/auth.service";

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (credentials: ILoginRequest) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await authService.login(credentials);
            localStorage.setItem('token', response.access_token);
            return response;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Произошла ошибка при входе');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (userData: IRegisterRequest) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await authService.register(userData);
            localStorage.setItem('token', response.access_token);
            return response;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Произошла ошибка при регистрации ');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
    };

    return {
        login,
        register,
        logout,
        isLoading,
        error
    };
};