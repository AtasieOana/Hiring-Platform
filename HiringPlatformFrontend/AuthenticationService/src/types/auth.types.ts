export interface RegisterRequest {
    email: string;
    password: string;
    username: string;
    accountType: string;
}

export interface RegisterResponse{
    email: string;
    roleName: string;
    username: string;
}