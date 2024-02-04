export interface RegisterCandidateRequest {
    email: string;
    password: string;
    lastname: string;
    firstname: string;
    accountType: string;
}

export interface RegisterEmployerRequest {
    email: string;
    password: string;
    companyName: string;
    street: string;
    region: string;
    city: string;
    country: string;
    zipCode: string;
    accountType: string;
}

export interface RegisterResponse {
    email: string;
    roleName: string;
}

export interface LoginResponse {
    token: string;
    expiresIn: number;
    roleName: string;
}

export interface ResetPasswordRequest {
    email: string;
    newPassword: string;
    token: string;
}

export interface UserGoogleRequest {
    email: string;
    username: string;
    givenName: string;
    familyName: string;
    accountType: string;
}
