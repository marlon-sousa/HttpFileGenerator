import StringBuilder from "@tsdotnet/string-builder";
import HttpRequest from "@src/entities/http-file";
import { isPlainObject } from "lodash";

type bodyType = "JSON" | "URL_ENCODED" | "RAW";

const REQUEST_BEGIN = "#####";

const requireIsObject = (obj: Record<string, any>, message: string): void => {
    if (!isPlainObject(obj)) {
        throw new Error(message);
    }
}

const bodiTypes: Record<string, bodyType> = {
    "application/x-www-form-urlencoded": "URL_ENCODED",
    "application/json": "JSON",
};

const getBodyType = (request: HttpRequest): bodyType => {
    const contentType = getHeaderValue(request, "Content-Type");
    return (contentType && bodiTypes[contentType]) || "RAW";
}

const toUrlEncode = (body: any): string => {
    requireIsObject(body, "unable to convert body to urlencoded format");
    return Object.entries(body).map(o => `${o[0]}=${o[1]}`).join("\n&");
};

const toJson = (body: any): string => {
    requireIsObject(body, "unable to convert body to JSON format");
    return JSON.stringify(body);
};

const bodyConverters: Record<string, (body: any) => string> = {
    "JSON": toJson,
    URL_ENCODED: toUrlEncode
};

const getHeaderValue = (request: HttpRequest, headerName: string): string | undefined => request.headers.find(h => h.name === headerName)?.value;

const getHeaders = (request: HttpRequest): string => `${request.headers.map(h => `${h.name}: ${h.value}`).join("\n")}\n\n`;

const getParams = (request: HttpRequest): string => {
    const params = request?.params?.map(p => `${p.name}=${p.value}`).join("\n&") || "";
    return params.length > 0 ? `?${params}\n` : params;
}

const getName = (request: HttpRequest): string => `# @name ${request.name}`;

const getURL = (request: HttpRequest): string => `${request.url} HTTP/1.1`;

const getBody = (request: HttpRequest): string => {
    if (!request.body) {
        return "";
    }
    return bodyConverters[getBodyType(request)](request.body);
}

const toString = (request: HttpRequest): string => {
    const result = new StringBuilder(REQUEST_BEGIN);
    result.appendLine(getName(request))
        .append(request.verb, " ", getURL(request), "\n")
        .append(getParams(request))
        .append(getHeaders(request))
        .append(getBody(request));
    return result.toString()
};

export default {
    getBody,
    getHeaders,
    getName,
    getParams,
    getURL,
    toString,
};