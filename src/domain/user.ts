export type User = {
    userId: string;
    userName?: string;
    password?: string;
    email?: string;
    role?: Role;
    ssn?: string;
    phone?: string;
    addr?: string;
    regDate?: Date;
};

export enum Role {
    USER = "user",
    SELLER = "seller",
    ADMIN = "admin"
};