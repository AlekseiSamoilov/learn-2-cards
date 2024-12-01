export interface ICategory {
    id: string;
    title: string;
}

export interface IWordCreate {
    id: string;
    frontside: string;
    backside: string;
    categoryId: string;
    hintImageUrl?: string;
}

export interface IWord extends IWordCreate {
    totalShows: number;
    correctAnswers: number;
}