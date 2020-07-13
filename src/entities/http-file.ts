type HttpRequestBerbs = "GET" | "PATCH" | "POST" | "PUT";

export interface RequestHeader {
    name: string;
    value: string;
}

export interface RequestVar {
    name: string;
    value: string;
}

export interface RequestParam {
    name: string;
    value: string;
}

export default interface HttpRequest {
    body?: Object;
    headers: Array<RequestHeader>;
    name: string;
    params?: Array<RequestParam>;
    url: string;
    variables?: Array<RequestVar>;
    verb: HttpRequestBerbs;
}