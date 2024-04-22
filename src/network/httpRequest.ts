import axios, {AxiosResponse} from "axios";

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
    params?: object;
    method?: HttpMethod;
    body?: object;
    headers?: object;
    bearerToken?: string;
    withCredentials?: boolean;
};

export default function httpRequest({
    url,
    callback,
    params,
    method,
    body,
    headers,
    bearerToken,
    withCredentials
}: RequestConfig) {
    sendRequest(
        url,
        callback,
        params,
        method,
        body,
        headers,
        bearerToken,
        withCredentials
    );
}

function sendRequest(
    url: string,
    callback: (response: AxiosResponse<any, any>) => void,
    params: undefined | object = undefined,
    method: HttpMethod = HttpMethod.GET,
    body: undefined | object = undefined,
    headers: undefined | object = undefined,
    token: undefined | string = undefined,
    withCredentials = false
) {
    const configData = {url, withCredentials, method} as any;

    if (params) {
        configData.params = params;
    }

    if (headers) {
        configData.headers = headers;
    }

    if (token) {
        if (configData.headers) {
            configData.headers = {
                ...headers,
                Authorization: `Bearer ${token}`
            };
        } else {
            configData.headers = {
                Authorization: `Bearer ${token}`
            };
        }
    }

    if (body) {
        configData.data = body;
    }

    axios(configData).then(callback);
}
