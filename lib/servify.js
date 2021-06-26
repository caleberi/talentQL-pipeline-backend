const http = require("http");
const https = require("https");

const promisifyServer = function (port, options = []) {
  const opt = Array.isArray(options) && options.length == 0 ? false : options;
  return new Promise((reject, resolve) => {
    try {
      if (opt) {
        const server = http
          .createServer((request, response) => {
            // do so check on the
          })
          .listen(port, ...opt);
        resolve(server);
      }
    } catch (err) {
      reject(err);
    }
  });
};
class Servify {
  #routes = {};
  #settings = {};
  #locals = {};
  constructor(port, cb) {
    this.port = port || 4000;
    this.callback =
      typeof cb == "function"
        ? cb
        : () => console.log("Server is listening on port %d ", this.port);
  }
  get(endPoint, resolver) {
    this.#routes[endPoint] = {
      method: "GET",
      callback: resolver,
    };
  }

  post(endPoint, resolver) {
    this.#routes[endPoint] = {
      method: "GET",
      callback: resolver,
    };
  }
  put(endPoint, resolver) {
    this.#routes[endPoint] = {
      method: "GET",
      callback: resolver,
    };
  }
  delete(endPoint, resolver) {
    this.#routes[endPoint] = {
      method: "GET",
      callback: resolver,
    };
  }
}
