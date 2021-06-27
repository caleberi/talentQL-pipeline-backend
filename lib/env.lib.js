const path = require("path");
const fs = require("fs");

class EnvFileReader {
  constructor(filePath) {
    this.path = path.resolve(
      __dirname,
      typeof filePath == "undefined" || typeof filePath == ""
        ? "../.env"
        : filePath
    );
    this.environmentMapTable = {};
  }
  fillEnvironmentMapTable(table, data) {
    const lines = data
      .split("\n")
      .filter((line) => line !== "" || line !== "\n" || line !== "\r");
    lines.forEach(function (line) {
      let [key, value] = line.split("=");
      table[key.trim()] = value.trim();
    });
  }
  loadProcessEnv(table) {
    for (const entry in table) {
      if (!process.env.hasOwnProperty(entry)) process.env[entry] = table[entry];
    }
  }
  parseEnvFile() {
    try {
      let envData = fs.readFileSync(this.path, { encoding: "utf8" });
      this.fillEnvironmentMapTable(this.environmentMapTable, envData);
      this.loadProcessEnv(this.environmentMapTable);
    } catch (err) {
      console.log(err);
    }
  }
  config() {
    try {
      this.parseEnvFile();
    } catch (err) {
      console.log(err);
    }
  }
}

function configure(path) {
  const EnvReader = new EnvFileReader(path);
  EnvReader.config();
}
module.exports = configure;
