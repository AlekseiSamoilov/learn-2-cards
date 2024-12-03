export interface ILoginRequest {
    login: string;
    password: string;
}

export interface IRegisterRequest {
    login: string;
    password: string;
}

export interface IResetPasswordRequest {
    login: string;
    recoveryCode: string;
    newPassword: string;
}

export interface IAuthResponse {
    user: {
        id: string;
        login: string;
        recoveryCode: string;
    }
}

export interface IAuthError {
    message: string;
    statusCode: number;
}

export interface IBackendError {
    statusCode: number;
    message: string;
    error?: string;
}