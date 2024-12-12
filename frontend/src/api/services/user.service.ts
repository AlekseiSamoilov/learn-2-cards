import { IUser } from "../../types/types";
import api from "../instance";

export const userService = {
    async getAll(): Promise<IUser[]> {
        const response = await api.get('/users');
        return response.data;
    },

    async getOne(id: string): Promise<IUser> {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    async getByLogin(login: string): Promise<IUser> {
        const response = await api.get(`/users/${login}`);
        return response.data;
    },

    async update(id: string, data: Partial<IUser>): Promise<IUser> {
        const response = await api.patch(`/users/${id}`, data);
        return response.data;
    },

    async remove(id: string): Promise<void> {
        await api.delete(`/users/${id}`);
    },

    async getCurrentUser(): Promise<IUser> {
        try {
            const response = await api.get('/users/me');
            console.log('getCurrentUser response:', response.data);
            return response.data
        } catch (error) {
            console.error('getCurrentUser', error);
            throw error;
        }
    },

    async updateDisplayName(displayName: string): Promise<IUser> {
        try {
            const response = await api.patch('/users/display-name', { displayName });
            console.log('Update display name response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Update display name error:', error);
            throw error;
        }
    },
};