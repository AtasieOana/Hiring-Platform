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

export interface CandidateResponse {
    candidate: Candidate;
    token: string;
}

