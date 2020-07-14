import { expect } from "chai";
import httpFile from "@src/entities/http-file";
import request from "@src/business/request/ast-to-http-request";


describe("ast to http request", () => {
    it("should generate named request", () => {
        const file: httpFile = {
            name: "test",
            headers: [],
            verb: "GET",
            url: "http://localhost",
        };
        expect(request.getName(file)).to.be.equal("# @name test");
    });

    it("should return url", () => {
        const file: httpFile = {
            name: "test",
            headers: [],
            verb: "GET",
            url: "http://localhost",
        };
        expect(request.getURL(file)).to.be.equal("http://localhost HTTP/1.1");
    });

    it("should return no headers", () => {
        const file: httpFile = {
            name: "test",
            headers: [],
            verb: "GET",
            url: "http://localhost",
        };
        expect(request.getHeaders(file)).to.be.equal("\n\n");
    })

    it("should return one header in the correct format", () => {
        const file: httpFile = {
            name: "test",
            headers: [{
                name: "content-type",
                value: "application/JSON"
            }
            ],
            verb: "GET",
            url: "http://localhost",
        };
        expect(request.getHeaders(file)).to.be.equal("content-type: application/JSON\n\n");
    });

    it("should return headers with correct format separated by line", () => {
        const file: httpFile = {
            name: "test",
            headers: [{
                name: "content-type",
                value: "application/JSON"
            }, {
                name: "content-length",
                value: "5",
            }
            ],
            verb: "GET",
            url: "http://localhost",
        };
        expect(request.getHeaders(file)).to.be.equal("content-type: application/JSON\ncontent-length: 5\n\n");
    });

    it("should return no params", () => {
        const file: httpFile = {
            name: "test",
            headers: [],
            verb: "GET",
            url: "http://localhost",
        };
        expect(request.getParams(file)).to.be.equal("");
    });


    it("should return one param", () => {
        const file: httpFile = {
            name: "test",
            headers: [],
            verb: "GET",
            params: [{
                name: "parameter1",
                value: "value1",
            }],
            url: "http://localhost",
        };
        expect(request.getParams(file)).to.be.equal("?parameter1=value1\n");
    });

    it("should return multiple params", () => {
        const file: httpFile = {
            name: "test",
            headers: [],
            verb: "GET",
            params: [{
                name: "parameter1",
                value: "value1",
            }, {
                name: "parameter2",
                value: "value2",
            }],
            url: "http://localhost",
        };
        expect(request.getParams(file)).to.be.equal("?parameter1=value1\n&parameter2=value2\n");
    });

    it("should return body in JSON format", () => {
        const file: httpFile = {
            name: "test",
            verb: "GET",
            headers: [{
                name: "Content-Type",
                value: "application/json",
            }],
            body: {
                parameter1: "value1",
                parameter2: "value2",
            },
            url: "http://localhost",
        };
        expect(request.getBody(file)).to.be.equal(JSON.stringify(file.body));
    });

    it("should generate request without headers ", () => {
        const expectedHttpRequest = `###### @name test\nGET http://localhost HTTP/1.1\n?parameter=value1\n&parameter2=value2\n\n\n`;
        const file: httpFile = {
            name: "test",
            verb: "GET",
            headers: [],
            params: [{
                name: "parameter",
                value: "value1",
            }, {
                name: "parameter2",
                value: "value2",
            }],
            url: "http://localhost",
        };
        expect(request.toString(file)).to.be.equal(expectedHttpRequest);
    });

    it("should generate full request", () => {
        const expectedHttpRequest = `###### @name test\nGET http://localhost HTTP/1.1\n?parameter=value1\n&parameter2=value2\nContent-Type: application/json\n\n{"parameter1":"value1","parameter2":"value2"}`;
        const file: httpFile = {
            name: "test",
            verb: "GET",
            headers: [{
                name: "Content-Type",
                value: "application/json",
            }],
            params: [{
                name: "parameter",
                value: "value1",
            }, {
                name: "parameter2",
                value: "value2",
            }],
            body: {
                parameter1: "value1",
                parameter2: "value2",
            },
            url: "http://localhost",
        };
        expect(request.toString(file)).to.be.equal(expectedHttpRequest);
    });
});
