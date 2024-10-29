import { TValidationRule } from "../../types/validation";

export const loginValidationRules: TValidationRule[] = [
    {
        validate: (value: string) => value.length >= 3,
        errorMessage: 'Логин не может быть короче 3 символов'
    },
    {
        validate: (value: string) => value.length <= 10,
        errorMessage: 'Логин не может быть длинее 10 символов'
    },
];

export const passwordValidationRules: TValidationRule[] = [
    {
        validate: (value: string) => value.length >= 6,
        errorMessage: 'Пароль не должен быть короче 6 символов'
    },
    {
        validate: (value: string) => value.length <= 10,
        errorMessage: 'Пароль не должен быть длинее 10 символов'
    },
];

export const createConfirmPasswordRules = (compareWith: string): TValidationRule[] => [
    {
        validate: (value: string) => value === compareWith,
        errorMessage: 'Пароли не совпадают'
    }
]