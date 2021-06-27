const config = require("./config/settings.config");
const Servify = require("./lib/servify.lib");
const app = new Servify();

app.listen(config.port, (port) => {
  return () => console.log(`Server running at http://localhost:${port} `);
});
