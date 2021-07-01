const {
  CreditCardDetails,
  CreditCardError,
} = require("../model/creditCard.model");
exports.echo = (request, response) => {
  response.status(200).json(request.context);
};

exports.validateCardJson = (request, response) => {
  try {
    let { body } = request.context;
    let { cardNumber, cvv, mobileNos, phoneNumber, email, expiryDate } = body;
    let { error, success } = new CreditCardDetails(
      cardNumber,
      expiryDate,
      cvv,
      email,
      mobileNos,
      phoneNumber
    ).validate();
    if (error.errors.length) {
      throw new CreditCardError(error, "Card Validation Error");
    }
    response.status(200).json(success);
    return;
  } catch (err) {
    response.status(400).json(err);
  }
};

exports.ping = (request, response) => {
  let _ = request;
  response
    .status(200)
    .send("<div style='color:red;'>Hello World</div>", "text/html");
};
