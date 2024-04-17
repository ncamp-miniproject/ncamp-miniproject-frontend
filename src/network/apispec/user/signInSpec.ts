/**
 * A request for signing in
 * 
 * path: /api/users/account/sign-in
 * method: POST
 * query parameter: none
 */

export type SignInRequestBody = {
    userId: string;
    password: string;
}

export type SignInResponseBody = {
    success: boolean;
}