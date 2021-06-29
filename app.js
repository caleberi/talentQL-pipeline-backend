const { request } = require("http");
const config = require("./config/settings.config");
const Servify = require("./lib/servify.lib");
const app = new Servify();

app
  .get("/card", (request, response) => {
    response.status(200).json(request.context);
  })
  .post("/card/:id/book/:book", (request, response) => {
    response.status(200).xml(request.context);
  });

app.listen(config.port, (port) => {
  return () => console.log(`Server running at http://localhost:${port} `);
});
