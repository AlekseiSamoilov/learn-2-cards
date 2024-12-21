export interface ICard {
    _id: string;
    frontside: string;
    backside: string;
    categoryId: string;
    totalShows: number;
    correctAnswers: number;
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ICreateCardDto {
    id: string;
    frontside: string;
    backside: string;
    imageUrl?: string;
    // categoryId: string;
}

export interface IUpdateCardDto extends ICreateCardDto {
    totalShows?: number;
    correctAnswers?: number;
}

export interface ICardsReponse {
    cards: ICard[];
    message?: string;
}

export interface ICardResponse extends ICard {
    _id: string;
}