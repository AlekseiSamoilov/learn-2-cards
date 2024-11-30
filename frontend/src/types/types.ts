export interface ICategory {
    id: string;
    title: string;
}

export interface IWord {
    id: string;
    frontside: string;
    backside: string;
    categoryId: string;
    hintImageUrl?: string;
}