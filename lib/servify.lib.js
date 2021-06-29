const http = require("http");
const { StringDecoder } = require("string_decoder");
const decoder = new StringDecoder("utf-8");
const xmlToJson = require("./xmlToJson.lib");
const jsonToXml = require("./jsonToXml.lib");

function extractParams(path, routes, map) {
  var fragments = path.split("/").filter((token) => token != ""); //O(N)
  var possibleEndPointRepresentation;
  var mappedRoutePath;
  Object.keys(routes).forEach((route) => {
    let splittedRoute = route.split("/").filter((token) => token != ""); //O(N*2)
    possibleEndPointRepresentation =
      splittedRoute.length == fragments.length &&
      splittedRoute[0] == fragments[0]
        ? splittedRoute
        : [];
  });
  mappedRoutePath =
    possibleEndPointRepresentation.length !== 0
      ? "/" + possibleEndPointRepresentation.join("/")
      : path;
  for (let idx = 0; idx < possibleEndPointRepresentation.length; idx++) {
    if (possibleEndPointRepresentation[idx].startsWith(":")) {
      let key = possibleEndPointRepresentation[idx].substr(
        1,
        possibleEndPointRepresentation.length
      );
      map[key] = fragments[idx];
    }
  }
  return mappedRoutePath;
}

class Servify {
  #routes = {
    notFound: (request, response) => {
      let _ = request;
      response.statusMessage = "Not Found";
      response.status(404).json(
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
  bodyParser(data, request, response) {
    if (
      request.headers.hasOwnProperty("content-type") &&
      request.headers["content-type"] === "application/json"
    ) {
      return this.jsonParser(data, request, response);
    }
    if (
      request.headers.hasOwnProperty("content-type") &&
      request.headers["content-type"] == "application/xml"
    ) {
      return this.xmlParser(data, request, response);
    }
  }
  jsonParser(data, request, response) {
    let _ = response;
    if (
      !request.headers.hasOwnProperty("content-type") ||
      request.headers["content-type"] === "application/json"
    ) {
      return JSON.parse(data);
    }
  }
  xmlParser(data, request, response) {
    let _ = response;
    if (
      !request.headers.hasOwnProperty("content-type") ||
      request.headers["content-type"] == "application/xml"
    )
      return xmlToJson.xmlToJson(data);
  }

  routeHandler(path, method) {
    return typeof this.#routes[path] != "undefined" &&
      typeof this.#routes[path][method] != "undefined"
      ? this.#routes[path][method]
      : this.#routes.notFound;
  }
  engine() {
    return http.createServer((request, response) => {
      const { method, url, headers } = request;
      const parsedMethod = method.toLowerCase();
      const baseUrl = `http://${headers.host}/`;
      const parsedPath = new URL(url.replace("%20", ""), baseUrl);
      const trimmedPath = "/" + parsedPath.pathname.replace(/^\/+|\/+$/g, "");
      const parsedParams = {};
      const mappedRoutePath = extractParams(
        trimmedPath,
        this.#routes,
        parsedParams
      );
      const parsedQuery = {};
      for (let entry of parsedPath.searchParams.entries()) {
        const [key, value] = entry;
        if (!parsedQuery.hasOwnProperty(key)) parsedQuery[key] = value;
      }
      const chosenHandler = this.routeHandler(mappedRoutePath, parsedMethod);
      function extendResponse(response) {
        response.status = function (data) {
          this.statusCode = data;
          return this;
        };
        response.json = function (data) {
          this.setHeader("Content-Type", "application/json");
          this.end(JSON.stringify(data));
          return this;
        };
        response.send = function (data, type) {
          this.setHeader("Content-Type", type);
          this.end(data.toString("utf-8"));
          return this;
        };
        response.xml = function (data, options) {
          this.setHeader("Content-Type", "application/xml");
          this.end(jsonToXml(data, options));
          return this;
        };
      }

      let buffer = "";
      request.on("data", (chunk) => {
        buffer += decoder.write(chunk);
      });
      request.on("end", () => {
        buffer += decoder.end();
        if (buffer == "") buffer = "{}";
        extendResponse(response);
        this.cors(request, response);
        const payload = {
          method: parsedMethod,
          hostname: baseUrl,
          trimmedPath,
          query: parsedQuery,
          headers,
          body: this.bodyParser(buffer, request, response),
          params: parsedParams,
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
