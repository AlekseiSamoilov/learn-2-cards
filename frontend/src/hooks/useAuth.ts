import { useState } from "react"
import { IBackendError, ILoginRequest, IRegisterRequest } from "../api/types";
import { authService } from "../api/services/auth.service";
import axios from "axios";

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (credentials: ILoginRequest) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await authService.login(credentials);
            localStorage.setItem('token', response.token);
            return response;
        } catch (err: any) {
            if (axios.isAxiosError(err) && err.response?.data) {
                const backendError = err.response.data as IBackendError;
                setError(backendError.message);
            } else {
                setError('Произошла ошибка при входе');
            }
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
            localStorage.setItem('token', response.token);
            return response;
        } catch (err: any) {
            console.log('Registration error in useAuth', err);
            if (axios.isAxiosError(err) && err.response) {
                const message = err.response.data.message || 'Registration error';
                setError(message);
                console.log('Ошибка при регистрации', message);
            } else {
                setError('Неизвестная ошибка при регистрации');
            }
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