import axios, {AxiosResponse} from "axios";
import {ACCESS_TOKEN, REFRESH_TOKEN} from "../common/constants";

export enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    DELETE = "DELETE"
}

export type RequestConfig = {
    url: string;
    callback: (response: AxiosResponse<any, any>) => void;
    baseUrl?: string;
    params?: object;
    method?: HttpMethod;
    body?: object;
    headers?: object;
    withCredentials?: boolean;
};

export default function httpRequest({
    url,
    callback,
    baseUrl,
    params,
    method,
    body,
    headers,
    withCredentials
}: RequestConfig) {
    sendRequest(
        url,
        callback,
        baseUrl,
        params,
        method,
        body,
        headers,
        withCredentials
    );
}

function sendRequest(
    url: string,
    callback: (response: AxiosResponse<any, any>) => void,
    baseUrl: undefined | string = undefined,
    params: undefined | object = undefined,
    method: HttpMethod = HttpMethod.GET,
    body: undefined | object = undefined,
    headers: undefined | object = undefined,
    withCredentials = false
) {
    const configData = {url, withCredentials, method} as any;

    if (params) {
        configData.params = params;
    }

    if (headers) {
        configData.headers = headers;
    }

    const accessToken = localStorage.getItem(ACCESS_TOKEN);

    if (accessToken) {
        if (configData.headers) {
            configData.headers = {
                ...headers,
                Authorization: `Bearer ${accessToken}`
            };
        } else {
            configData.headers = {
                Authorization: `Bearer ${accessToken}`
            };
        }
    }

    if (body) {
        configData.data = body;
    }

    if (baseUrl) {
        configData.baseURL = baseUrl;
    }

    axios(configData)
        .then((response) => {
            const newAccessToken = response.headers["New-Access-Token"];
            localStorage.setItem(ACCESS_TOKEN, newAccessToken);
            callback(response);
        })
        .catch((error) => {
            console.error(error);
            const refreshToken = localStorage.getItem(REFRESH_TOKEN);

            if (refreshToken) {
                if (configData.headers) {
                    configData.headers = {
                        ...headers,
                        Authorization: `Bearer ${refreshToken}`
                    };
                } else {
                    configData.headers = {
                        Authorization: `Bearer ${refreshToken}`
                    };
                }
            }
            axios(configData)
                .then((response) => {
                    const newAccessToken = response.headers["New-Access-Token"];
                    const newRefreshToken =
                        response.headers["New-Refresh-Token"];
                    localStorage.setItem(ACCESS_TOKEN, newAccessToken);
                    localStorage.setItem(REFRESH_TOKEN, newRefreshToken);
                    callback(response);
                })
                .catch((error) => {
                    console.error(error);
                    // window.location.href = "/sign-in";
                    alert("Error");
                });
        });
}
