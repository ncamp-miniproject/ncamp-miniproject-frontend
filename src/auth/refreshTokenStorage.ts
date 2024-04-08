const REFRESH_TOKEN_KEY = "refresh_token";

export function storeRefreshToken(refreshToken: string) {
    // TODO: choose one between session storage and local storage for storing token
    // depending on the business logic
    sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function removeRefreshToken() {
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
}