import axios, {AxiosResponse} from "axios";

export enum HttpMethod {
    GET,
    POST,
    PUT,
    PATCH,
    DELETE
}

export default function httpRequest(
    url: string,
    callback: (response: AxiosResponse<any, any>) => void,
    params: undefined | object = undefined,
    method: HttpMethod | undefined = HttpMethod.GET,
    headers: undefined | object = undefined,
    token: undefined | string = undefined
) {
    sendRequest(url, callback, params, method, headers, token);
}

function sendRequest(
    url: string,
    callback: (response: AxiosResponse<any, any>) => void,
    params: undefined | object = undefined,
    method: HttpMethod | undefined = HttpMethod.GET,
    headers: undefined | object = undefined,
    token: undefined | string = undefined
) {
    const fullUrl = `${url}${getQueryParameter(params)}`;
    switch (method) {
        case HttpMethod.GET:
            axios.get(fullUrl, config(headers, token)).then(callback);
            break;
        case HttpMethod.PATCH:
            axios.patch(fullUrl, config(headers, token)).then(callback);
            break;
        default:
            return;
    }
}

function getQueryParameter(params: undefined | any = undefined) {
    if (params) {
        const query = Object.keys(params)
            .map((param) => `${param}=${params[param]}`)
            .join("&");
        return query !== "" ? `?${query}` : "";
    }
    return "";
}

function config(headers: undefined | object, token: undefined | string) {
    if (token) {
        headers = {
            ...headers,
            Authorization: `Bearer ${token}`
        };
    }
    return {
        headers,
        token
    };
}
