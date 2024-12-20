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

export interface IUser {
    login: string;
    password: string;
    recoveryCode: string;
    displayName: string;
}
