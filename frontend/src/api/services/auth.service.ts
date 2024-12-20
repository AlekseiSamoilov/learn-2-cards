import api from "../instance";
import { IAuthResponse, ILoginRequest, IRegisterRequest, IResetPasswordRequest, IResetPasswordResponse } from "../types";

export const authService = {
    async login(data: ILoginRequest): Promise<IAuthResponse> {
        const response = await api.post<IAuthResponse>('/auth/login', data);
        return response.data;
    },

    async register(data: IRegisterRequest): Promise<IAuthResponse> {
        try {
            const response = await api.post<any>('/auth/register', data);
            return response.data;
        } catch (error: any) {
            console.log('Registration error');
            throw error;
        }
    },

    async resetPassword(data: IResetPasswordRequest): Promise<IResetPasswordResponse> {
        try {
            const response = await api.post<IResetPasswordResponse>('/users/reset-password', data);
            return response.data;
        } catch (error: any) {
            console.error('Password reset error:', error);
            throw error;
        }
    },

    async logout(): Promise<void> {
        try {
            await api.post('/auth/logout');
            localStorage.removeItem('token');
        } catch (error) {
            console.log('Logout error:', error);
            localStorage.removeItem('token');
            throw error;
        }
    }
};