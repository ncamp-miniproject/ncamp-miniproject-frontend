export type LoginUser = {
    userId: string;
    role?: Role;
};

export enum Role {
    USER = "USER",
    SELLER = "SELLER",
    ADMIN = "ADMIN"
};