export type LoginUser = {
    userId: string;
    role?: Role;
};

export enum Role {
    USER = "user",
    SELLER = "seller",
    ADMIN = "admin"
};