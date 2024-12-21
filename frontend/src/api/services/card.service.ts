import api from "../instance";
import { ICard, ICardResponse, ICreateCardDto } from "../types/card.types";

export const cardService = {
    async createCard(data: ICreateCardDto): Promise<ICard> {
        try {
            const requestData = {
                id: data.id,
                frontside: data.frontside,
                backside: data.backside,
                imageUrl: data.imageUrl,
                // categoryId: data.categoryId
            };
            const response = await api.post<ICardResponse>(`/cards/${data.id}`, requestData);
            return response.data;
        } catch (error: any) {
            console.error('Create card error:', error);
            throw error;
        }
    }
}