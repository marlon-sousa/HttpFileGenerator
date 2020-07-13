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
        expect(request.getHeaders(file)).to.be.equal("");
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
        expect(request.getHeaders(file)).to.be.equal("content-type: application/JSON");
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
        expect(request.getHeaders(file)).to.be.equal("content-type: application/JSON\ncontent-length: 5");
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
        expect(request.getParams(file)).to.be.equal("?parameter1=value1");
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
        expect(request.getParams(file)).to.be.equal("?parameter1=value1\n&parameter2=value2");
    });
});
