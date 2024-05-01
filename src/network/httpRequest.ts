import axios, {AxiosResponse} from "axios";
import {ACCESS_TOKEN, REFRESH_TOKEN, apiServerUrl} from "../common/constants";

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
    withCredentials?: boolean;
    errorCallback?: (error: any) => void;
};

export default function httpRequest({
    url,
    callback,
    params,
    method,
    body,
    headers,
    withCredentials,
    errorCallback
}: RequestConfig) {
    sendRequest(
        url,
        callback,
        params,
        method,
        body,
        headers,
        withCredentials,
        errorCallback
    );
}

function sendRequest(
    url: string,
    callback: (response: AxiosResponse<any, any>) => void,
    params: undefined | object = undefined,
    method: HttpMethod = HttpMethod.GET,
    body: undefined | object = undefined,
    headers: undefined | object = undefined,
    withCredentials = true,
    errorCallback: (error: any) => void = () => {}
) {
    const configData = {url, withCredentials, method} as any;

    if (params) {
        configData.params = params;
    }

    if (headers) {
        configData.headers = headers;
    }

    const accessToken = localStorage.getItem(ACCESS_TOKEN);

    if (body) {
        configData.data = body;
    }

    configData.baseURL = apiServerUrl;

    const newConfigData = {...configData};
    if (configData.headers) {
        newConfigData.headers = {
            ...configData.headers,
            Authorization: accessToken ? `Bearer ${accessToken}` : "Bearer -"
        };
    } else {
        newConfigData.headers = {
            Authorization: accessToken ? `Bearer ${accessToken}` : "Bearer -"
        };
    }

    axios(newConfigData)
        .then((response) => {
            callback(response);
        })
        .catch((error) => {
            console.error("Access Token not valid");
            console.error(error);
            const refreshToken = localStorage.getItem(REFRESH_TOKEN);

            if (!refreshToken) {
                console.error("Refresh Token not exists");
                errorCallback(error);
                return;
            }

            axios({
                url: "/api/auth/refresh-token",
                baseURL: apiServerUrl,
                method: HttpMethod.POST,
                params: {
                    token: refreshToken
                }
            })
                .then((response) => {
                    const data = response.data as {
                        accessToken: string;
                        refreshToken: string;
                    };
                    console.log(data);
                    localStorage.setItem(ACCESS_TOKEN, data.accessToken);
                    localStorage.setItem(REFRESH_TOKEN, data.refreshToken);

                    const newConfigData2 = {...configData};
                    if (configData.headers) {
                        newConfigData2.headers = {
                            ...configData.headers,
                            Authorization: `Bearer ${data.accessToken}`
                        };
                    } else {
                        newConfigData2.headers = {
                            Authorization: `Bearer ${data.accessToken}`
                        };
                    }
                    axios(newConfigData2).then((response) =>
                        callback(response)
                    );
                })
                .catch((error) => {
                    console.log("Refresh Token not valid");
                    errorCallback(error);
                });
        });
}
