import axios, { AxiosResponse } from "axios";

export default function httpRequest(url: string, callback: (response: AxiosResponse<any, any>) => void) {
    // TODO: contain access token and refresh token
    axios.get(url).then(callback);
}