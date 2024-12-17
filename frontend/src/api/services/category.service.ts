import api from "../instance";
import { ICategory, ICreateCategoryDto, IUpdateCategoryDto, ICategoryResponse } from "../types/category.types";

export const categoryService = {
    async createCategory(data: ICreateCategoryDto): Promise<ICategory> {
        try {
            // Отправляем данные как объект, а не как JSON строку
            const requestData = {
                title: data.title
            };

            // Проверяем формат данных
            console.log('Request data:', requestData);

            const response = await api.post<ICategoryResponse>('/categories', requestData);
            return response.data;
        } catch (error: any) {
            console.error('Create category error:', error);
            throw error;
        }
    },

    async getAllCategories(): Promise<ICategory[]> {
        try {
            const response = await api.get<ICategory[]>('/categories');
            return response.data;
        } catch (error: any) {
            console.error('Get category error', error);
            throw error;
        }
    },

    async getCategoryById(id: string): Promise<ICategory> {
        try {
            const response = await api.get<ICategory>(`/categories/${id}`);
            return response.data;
        } catch (error: any) {
            console.error('Get category error', error);
            throw error;
        }
    },

    async updateCategory(id: string, data: IUpdateCategoryDto): Promise<ICategory> {
        try {
            const response = await api.patch<ICategory>(`/categories/${id}`, data);
            return response.data;
        } catch (error: any) {
            console.error('Update category error', error);
            throw error;
        }
    },

    async deleteCategory(id: string): Promise<void> {
        try {
            await api.delete(`/categories/${id}`);
        } catch (error: any) {
            console.error('Delete category error', error);
            throw error;
        }

    },

    async getAllUserCategories(userId: string): Promise<ICategory[]> {
        try {
            const response = await api.get<ICategory[]>(`/categories/user/${userId}`);
            return response.data;
        } catch (error: any) {
            console.error('Error get categories', error);
            throw error;
        }

    },
}