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

            return {
                user: {
                    id: response.data._doc._id || response.data._id,
                    login: response.data._doc.login || response.data.login,
                    recoveryCode: response.data._doc.recoveryCode || response.data.recoveryCode
                }
            };
        } catch (error: any) {
            console.log('Registration error details:', {
                error: error,
                status: error.response?.status,
                data: error.response?.data
            });
            throw error;
        }
    },

    async resetPassword(data: IResetPasswordRequest): Promise<void> {
        await api.post('/users/reset-password', data);
    }
};