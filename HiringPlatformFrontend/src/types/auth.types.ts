export interface Role {
    roleId: string;
    roleName: string;
    roleDescription: string;
}

export interface User {
    userId: string;
    email: string;
    password: string;
    registrationDate: Date;
    accountEnabled: number;
    userRole: Role;
}

export interface Candidate {
    candidateId: string;
    lastname: string;
    firstname: string;
    userDetails: User;
}

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
    name: string;
    givenName: string;
    familyName: string;
    accountType: string;
}

