require("../lib/env.lib")();
const environment = {};
environment.staging = {
  port: parseInt(process.env.PORT),
  env: process.env.NODE_ENV,
  clientKey: process.env.CLIENT_KEY,
  clientSecret: process.env.CLIENT_SECRET,
};

environment.production = {
  port: parseInt(process.env.PRODUCTION_PORT),
  env: process.env.NODE_ENV,
  clientKey: process.env.PRODUCTION_CLIENT_KEY,
  clientSecret: process.env.PRODUCTION_CLIENT_SECRET,
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
