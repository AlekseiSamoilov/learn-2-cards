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
    access_token: string;
    user: {
        id: string;
        login: string;
        recoveryPassword: string;
    }
}

export interface IAuthError {
    message: string;
    statusCode: number;
}