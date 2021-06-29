const { request } = require("http");
const config = require("./config/settings.config");
const Servify = require("./lib/servify.lib");
const cardResolver = require("./resolvers/card.resolver");
const app = new Servify();

app.get("/ping", cardResolver.ping);
app.get("/echo", cardResolver.echo);
app.post("/card", cardResolver.validateCard);

app.listen(config.port, (port) => {
  return () => console.log(`Server running at http://localhost:${port} `);
});
