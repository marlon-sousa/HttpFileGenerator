use std::fmt::Display;
use string_builder::Builder;

pub struct QueryParam {
    name: String,
    value: String,
}

pub struct Header {
    name: string,
    value: String,
}

enum Method: {
    GET,
    HEAD,
    PATCH,
    POST,
}

pub struct HttpRequest {
    name: String,
    comments: String,
    url: String,
    method: Method,
    headers: Vec<Header>,
    queryParams: Vec<QueryParam>,
    body: Option<String>,
}

impl HttpRequest {}

impl Display for HttpRequest {
    fn fmt(&self, _: &mut std::fmt::Formatter<'_>) -> std::result::Result<(), std::fmt::Error> {
        let mut request = Builder::default()
        .

    }
}
