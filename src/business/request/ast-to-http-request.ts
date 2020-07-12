import StringBuilder from "@tsdotnet/string-builder";
import HttpRequest from "@src/entities/http-file";
import { isPlainObject } from "lodash";

type bodyType = "JSON" | "QUERY" | "RAW";

const requestHeaderLine = "#####";

const requireIsObject = (obj: Record<string, any>, message: string): void => {
    if (!isPlainObject(obj)) {
        throw new Error(message);
    }
}

const bodiTypes: Record<string, bodyType> = {
    "application/x-www-form-urlencoded": "QUERY",
    "application/json": "JSON",
};

const getBodyType = (request: HttpRequest): bodyType => {
    const contentType = getHeaderValue(request, "Content-Type");
    return (contentType && bodiTypes[contentType]) || "RAW";
}

const toUrlEncode = (body: any): string => {
    requireIsObject(body, "unable to convert body to urlencoded format");
    const buff = new StringBuilder();
    for (const k in body) {
        buff.append(`${k}=${body[k]}\n&`);
    }
    const result = buff.toString();
    if (result.endsWith("\n&")) {
        return result.slice(0, -2);
    }
    return result;
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

const getHeaders = (request: HttpRequest): Array<string> => request.headers.map(h => `${h.name}: {h.value}\n`);

const getParams = (request: HttpRequest): string => {
    let result = "";
    if (request?.params.length > 0) {
        const buff = new StringBuilder("?");
        request.params.forEach(p => buff.append(`${p.name}=${p.value}\n&`));
        const tmp = buff.toString();
        result = tmp.endsWith("\n&") ? result.slice(0, -2) : tmp;
    }
    return result;
}

const getName = (request: HttpRequest): string => `# @name ${request.name}`;

const getBody = (request: HttpRequest): string => {
    if (!request.body) {
        return "";
    }
    return bodyConverters[getBodyType(request)](request.body);
}

export default (request: HttpRequest): string => {
    const result = new StringBuilder(requestHeaderLine);
    result.appendLine(getName(request))
        .append(request.verb, " ")
        .append(request.url, " HTTP/1.1")
        .appendLine(getParams(request))
        .appendLine(getHeaders(request))
        .appendLine()
        .appendLine(getBody(request));
    return result.toString()
};
