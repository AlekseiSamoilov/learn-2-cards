import api from "../instance";
import { ICard, ICardResponse, ICreateCardDto } from "../types/card.types";

export const cardService = {

    async getCardsByCategory(categoryId: string): Promise<ICard[]> {
        try {
            console.log('Fenching cards for category:', categoryId)
            const response = await api.get<ICard[]>(`/cards/category/${categoryId}`);
            return response.data;
        } catch (error: any) {
            console.error('Get cards error:', error);
            throw error;
        }
    },

    async createCard(data: ICreateCardDto, categoryId: string): Promise<ICard> {
        try {
            const requestData = {
                ...data,
                categoryId
            };

            const response = await api.post<ICardResponse>(`/cards/${categoryId}`, requestData);
            return response.data;
        } catch (error: any) {
            console.error('Create card error:', error);
            throw error;
        }
    },
}