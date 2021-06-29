exports.echo = (request, response) => {
  response.status(200).json(request.context);
};

exports.validateCard = (request, response) => {
  response.status(200).xml(request.context);
};

exports.ping = (request, response) => {
  response.status(200).send("Hello World", "text/plain");
};
