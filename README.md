# talentQL-pipeline-backend

A solution to talentQL pipeline initative program using javascript together with node js .
The overall implementation uses an inbuilt servify  http server built from ground up  and exposes few 
endpoints. The use of node inbuilt library is used extensively to implement certain functionality.

## Servify 

An http server built using http module from node core library  can be extended as much as possible . Although the current codebase is subject to refactor but mainly involves registering endpoint on an hash table together with resolver function for each endpoint . The code below briefly describe servify

```js

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
    // code block
  }
  post(endPoint, resolver) {
    // code block
  }
  put(endPoint, resolver) {
    // code block
  }
  delete(endPoint, resolver) {
    // code block
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
      // code block
  }
  authorize(request, response) {
    // code block
  }
  engine() {
    // code block
    // return http.server
  }
  listen(port, callback) {
    // code block
  }
}

```

Servify however sends response in only JSON & XML format only.

## How to run 

Use ```node app.js```  to run this file but It need the env file included in this codebase.

## Postman Collection 

This is located in the root folder of this project

## Contribution

This codebase is just a starter file for something wonderful and it is open to contribution.

## Enviroment 
The envrionment should be removed but was intentionally left there to prevent crashing of app.
