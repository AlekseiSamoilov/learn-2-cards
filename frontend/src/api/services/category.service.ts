import api from "../instance";
import { ICategory, ICreateCategoryDto, IUpdateCategoryDto } from "../types/category.types";

export const categoryService = {
    async createCategory(data: ICreateCategoryDto): Promise<ICategory> {
        const response = await api.post<ICategory>('/categories', data);
        return response.data;
    },

    async getAllCategories(): Promise<ICategory[]> {
        const response = await api.get<ICategory[]>('/categories');
        return response.data;
    },

    async getCategoryById(id: string): Promise<ICategory> {
        const response = await api.get<ICategory>(`/categories/${id}`);
        return response.data;
    },

    async updateCategory(id: string, data: IUpdateCategoryDto): Promise<ICategory> {
        const response = await api.patch<ICategory>(`/categories/${id}`, data);
        return response.data;
    },

    async deleteCategory(id: string): Promise<void> {
        await api.delete(`/categories/${id}`);
    },

    async getAllUserCategories(userId: string): Promise<ICategory[]> {
        const response = await api.get<ICategory[]>(`/categories/user/${userId}`);
        return response.data;
    },
}