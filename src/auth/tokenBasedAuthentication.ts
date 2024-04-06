import {Cookies} from "react-cookie";

const cookies = new Cookies();

export const AUTH_TOKEN_NAME = "auth";

export function validateToken() {
    const token = cookies.get(AUTH_TOKEN_NAME);
    
    // TODO: validate token by requesting to the server
    const result = token !== undefined;

    return result;
}

export function setToken(token: string) {
    cookies.set(AUTH_TOKEN_NAME, token);
}