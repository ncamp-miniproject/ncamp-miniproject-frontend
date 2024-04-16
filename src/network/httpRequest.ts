import axios, {AxiosResponse} from "axios";

export default function httpRequest(
    url: string,
    callback: (response: AxiosResponse<any, any>) => void,
    params: undefined | object = undefined,
    headers: undefined | object = undefined,
    token: undefined | string = undefined
) {
    // TODO: contain access token and refresh token
    axios.get(url, config(headers, params, token)).then(callback);
}

function config(
    headers: undefined | object,
    params: undefined | object,
    token: undefined | string
) {
    if (token) {
        headers = {
            ...headers,
            Authorization: `Bearer ${token}`
        };
    }
    return {
        headers,
        params,
        token
    };
}
