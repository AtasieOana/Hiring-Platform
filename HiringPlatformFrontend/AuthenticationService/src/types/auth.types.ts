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