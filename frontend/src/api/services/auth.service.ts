import api from "../instance";
import { IAuthResponse, ILoginRequest, IRegisterRequest, IResetPasswordRequest } from "../types";

export const authService = {
    async login(data: ILoginRequest): Promise<IAuthResponse> {
        const response = await api.post<IAuthResponse>('/auth/login', data);
        return {
            token: response.data.token,
            user: response.data.user
        };
    },

    async register(data: IRegisterRequest): Promise<IAuthResponse> {
        console.log('Sending registration data:', data);
        try {
            const response = await api.post<any>('/auth/register', data);
            console.log('Raw registration data:', response.data);

            return {
                token: response.data.access_token,
                user: response.data.user
            };
        } catch (error: any) {
            console.log('Registration error');
            throw error;
        }
    },

    async resetPassword(data: IResetPasswordRequest): Promise<void> {
        await api.post('/users/reset-password', data);
    }
};