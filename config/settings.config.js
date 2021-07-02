require("../lib/env.lib")();
const environment = {};
environment.staging = {
  port: parseInt(process.env.PORT),
  env: process.env.NODE_ENV,
  clientId: process.env.CLIENT_ID,
  clientApiKey: process.env.CLIENT_API_KEY,
};

environment.production = {
  port: parseInt(process.env.PRODUCTION_PORT),
  env: process.env.NODE_ENV,
  clientId: process.env.PRODUCTION_CLIENT_ID,
  clientApiKey: process.env.PRODUCTION_CLIENT_API_KEY,
};

let currentEnv =
  typeof process.env.NODE_ENV.toLowerCase() == "string" &&
  typeof process.env.NODE_ENV != "undefined"
    ? process.env.NODE_ENV.toLowerCase()
    : "staging";

// eslint-disable-next-line no-prototype-builtins
let appEnvironment = environment.hasOwnProperty(currentEnv)
  ? environment[currentEnv]
  : environment.staging;

module.exports = appEnvironment;
