const {
  CreditCardDetails,
  CreditCardError,
} = require("../validator/credit-card.validator");

exports.echo = (request, response) => {
  response.status(200).json(request.context);
};

exports.validateCardJson = (request, response) => {
  try {
    let { body } = request.context;
    let { cardNumber, cvv, mobileNos, phoneNumber, email, expiryDate } = body;
    let {
      error: { errors: errors },
      success,
    } = new CreditCardDetails(
      cardNumber,
      expiryDate,
      cvv,
      email,
      mobileNos,
      phoneNumber
    ).validate();
    if (errors.length) {
      throw new CreditCardError(error, "Card Validation Error");
    }
    response.status(200).json(success);
    return;
  } catch (err) {
    response.status(400).json(err);
  }
};

exports.validateCardXML = (request, response) => {
  try {
    let { body } = request.context;
    let { cardNumber, cvv, mobileNos, phoneNumber, email, expiryDate } = body;
    let {
      error: { errors: errors },
      success,
    } = new CreditCardDetails(
      cardNumber,
      expiryDate,
      cvv,
      email,
      mobileNos,
      phoneNumber
    ).validate();
    if (errors.length) {
      throw new CreditCardError(error, "Card Validation Error");
    }
    response.status(200).xml(success);
    return;
  } catch (err) {
    response.status(400).xml(err);
  }
};

exports.ping = (request, response) => {
  let _ = request;
  response
    .status(200)
    .send("<div style='color:red;'>Hello World</div>", "text/html");
};
