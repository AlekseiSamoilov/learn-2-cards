import { TValidationRule } from "../../types/validationRule";

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
];

export const recoveryCodeValidationRules: TValidationRule[] = [
    {
        validate: (value: string) => value.length >= 6,
        errorMessage: 'Код должен содержать 6 символов'
    },
    {
        validate: (value: string) => /^[A-Z0-9]+$/.test(value),
        errorMessage: 'Код должен содержаь только заглавные буквы и цифры'
    }
];

export const nameValidationRules: TValidationRule[] = [
    {
        validate: (value: string) => value.length <= 25,
        errorMessage: 'Имя не должно быть длиннее 25 символов'
    },
    {
        validate: (value: string) => value.length >= 2,
        errorMessage: 'Имя должно быть длинее 2 символов'
    }
];

export const categoryNameValidation: TValidationRule[] = [
    {
        validate: (value: string) => value.length >= 2,
        errorMessage: 'Не менее 2 символов!'
    },
    {
        validate: (value: string) => value.length <= 30,
        errorMessage: 'Не больше 30 символов!'
    }
]