export type TValidationRule = {
    validate: (value: string) => boolean;
    errorMessage: string;
}

