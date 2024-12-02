import api from "../instance";
import { IAuthResponse, ILoginRequest, IRegisterRequest, IResetPasswordRequest } from "../types";

export const authService = {
    async login(data: ILoginRequest): Promise<IAuthResponse> {
        const response = await api.post<IAuthResponse>('/auth/login', data);
        return response.data;
    },

    async register(data: IRegisterRequest): Promise<IAuthResponse> {
        const response = await api.post<IAuthResponse>('/auth/register', data);
        return response.data;
    },

    async resetPassword(data: IResetPasswordRequest): Promise<void> {
        await api.post('/auth/reset-password', data);
    }
};