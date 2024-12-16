export interface ICategory {
    _id: string;
    title: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface ICreateCategoryDto {
    title: string;
}

export interface IUpdateCategoryDto {
    title: string;
}

export interface ICategoriesReponse {
    categories: ICategory[];
    message?: string;
}