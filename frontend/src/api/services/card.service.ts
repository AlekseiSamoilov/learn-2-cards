import api from "../instance";
import { ICard, ICardResponse, ICreateCardDto, IUpdateCardDto } from "../types/card.types";

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
                frontside: data.frontside,
                backside: data.backside,
                categoryId,
                ...(data.imageUrl && { imageUrl: data.imageUrl })
            };

            const response = await api.post<ICardResponse>(`/cards/${categoryId}`, requestData);
            return response.data;
        } catch (error: any) {
            console.error('Create card error:', error);
            throw error;
        }
    },

    async incrementTotalShows(cardId: string): Promise<ICard> {
        try {
            const response = await api.patch<ICardResponse>(`/cards/${cardId}/shows`);
            return response.data;
        } catch (error) {
            console.error('Patch card total shows error:', error);
            throw error;
        }
    },

    async incrementCorrectAnswers(cardId: string): Promise<ICard> {

        try {
            const response = await api.patch<ICardResponse>(`/cards/${cardId}/correct`);
            return response.data;
        } catch (error) {
            console.error('Patch card correct answers error:', error);
            throw error;
        }
    },

    async updateCard(cardId: string, data: IUpdateCardDto): Promise<ICard> {
        try {
            const response = await api.patch<ICard>(`/cards/${cardId}`, data);
            console.log('Data from card.service.ts', data)
            console.log(response)
            return response.data;
        } catch (error: any) {
            console.error('Update card error:', error);
            throw error;
        }
    },

    async deleteCard(cardId: string): Promise<void> {
        try {
            await api.delete(`/cards/${cardId}`);
        } catch (error) {
            console.error('Delete card error:', error);
            throw error;
        }
    }
}