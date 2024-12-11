import api from "../instance";
import { IAuthResponse, ILoginRequest, IRegisterRequest, IResetPasswordRequest } from "../types";

export const authService = {
    async login(data: ILoginRequest): Promise<IAuthResponse> {
        const response = await api.post<IAuthResponse>('/auth/login', data);
        return response.data;
    },

    async register(data: IRegisterRequest): Promise<IAuthResponse> {
        console.log('Sending registration data:', data);
        try {
            const response = await api.post<any>('/auth/register', data);
            console.log('Raw registration data:', response.data);
            return response.data;
        } catch (error: any) {
            console.log('Registration error');
            throw error;
        }
    },

    async resetPassword(data: IResetPasswordRequest): Promise<void> {
        await api.post('/users/reset-password', data);
    }
};