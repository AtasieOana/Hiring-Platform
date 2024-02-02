export interface RegisterRequest {
    email: string;
    password: string;
    username: string;
    accountType: string;
}

export interface RegisterResponse {
    email: string;
    roleName: string;
    username: string;
}

export interface LoginResponse {
    token: string;
    expiresIn: number;
    roleName: string;
    username: string;
}

export interface ResetPasswordRequest {
    email: string;
    newPassword: string;
    token: string;
}

export interface UserGoogleRequest {
    email: string;
    username: string;
    accountType: string;
}
