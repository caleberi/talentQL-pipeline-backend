const http = require("http");
const { StringDecoder } = require("string_decoder");
const decoder = new StringDecoder("utf-8");

class Servify {
  #routes = {
    notFound: (request, response) => {
      let _ = request;
      response.statusCode = 404;
      response.statusMessage = "Not Found";
      response.end(
        JSON.stringify({
          code: 400,
          msg: "Not Found",
        })
      );
    },
  };
  constructor() {
    this.locals = {};
  }
  get(endPoint, resolver) {
    if (!this.#routes.hasOwnProperty(endPoint)) {
      this.#routes[endPoint] = {};
    }
    this.#routes[endPoint][this.get.name] = resolver;
    return this;
  }
  post(endPoint, resolver) {
    if (!this.#routes.hasOwnProperty(endPoint)) {
      this.#routes[endPoint] = {};
    }
    this.#routes[endPoint][this.post.name] = resolver;
    return this;
  }
  put(endPoint, resolver) {
    if (!this.#routes.hasOwnProperty(endPoint)) {
      this.#routes[endPoint] = {};
    }
    this.#routes[endPoint][this.put.name] = resolver;
    return this;
  }
  delete(endPoint, resolver) {
    if (!this.#routes.hasOwnProperty(endPoint)) {
      this.#routes[endPoint] = {};
    }
    this.#routes[endPoint][this.delete.name] = resolver;
    return this;
  }

  cors(request, response, options = {}) {
    let _ = request;
    response.headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Request-Method": "GET,PUT,DELETE,POST,PATCH",
      "Access-Control-Request-Headers":
        "Origin, X-Requested-With, Content-Type, Accept",
      ...options,
    };
  }
  JSONParser(data, request, response) {
    const { headers } = request;
    if (headers["content-type"] == "application/json")
      response.headers["content-type"] = "application/json";
    return JSON.parse(data);
  }
  routeHandler(path, method) {
    return typeof this.#routes[path] != "undefined" &&
      this.#routes[path][method]
      ? this.#routes[path][method]
      : this.#routes.notFound;
  }
  engine() {
    return http.createServer((request, response) => {
      const { method, url, headers } = request;
      const parsedMethod = method.toLowerCase();
      const baseUrl = `http://${headers.host}`;
      const parsedPath = new URL(url, baseUrl);
      const trimmedPath = parsedPath.pathname.replace(/^\/+|\/+$/g, "");
      const parsedQuery = {};
      for (const entry in parsedPath.searchParams.entries()) {
        const [key, value] = entry;
        if (!parsedQuery.hasOwnProperty(key)) parsedQuery[key] = value;
      }
      const chosenHandler = this.routeHandler(trimmedPath);
      let buffer = "";
      request.on("data", (chunk) => {
        buffer += decoder.write(chunk);
      });
      request.on("end", () => {
        buffer += decoder.end();
        if (buffer == "") buffer = "{}";
        this.cors(request, response);
        const payload = {
          method: parsedMethod,
          hostname: baseUrl,
          trimmedPath,
          query: parsedQuery,
          headers,
          body: this.JSONParser(buffer, request, response),
        };
        if (chosenHandler.name !== "notFound") request.context = payload;
        chosenHandler(request, response);
      });
    });
  }
  listen(port, callback) {
    this.engine().listen(port, callback(port));
  }
}
module.exports = Servify;
