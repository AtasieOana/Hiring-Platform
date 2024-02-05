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

export interface Employer {
    employerId: string;
    companyName: string;
    userDetails: User;
}

export interface EmployerResponse {
    employer: Employer;
    token: string;
}
