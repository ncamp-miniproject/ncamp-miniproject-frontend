/**
 * Query a single user info given userId
 * 
 * path: /api/users/{userId}
 * method: GET
 * query parameter: none
 */

export type UserResponseBody = {
    userId: string;
    userName: string;
    role: string;
    ssn?: string;
    phone?: string;
    addr?: string;
    email: string;
    regDate: string; // yyyy-mm-dd
}