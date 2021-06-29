const luhn = require("../algorithms/luhn.algorithm");
module.exports = CreditCard;
class CreditCardError extends Error {
  constructor(...params) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CreditCardError);
    }
    this.name = "CreditCardError";
    this.date = new Date();
  }
}
class CreditCardDetails {
  constructor(
    _creditCardNumber,
    _expirationDate,
    _CVV2,
    _email,
    _mobile,
    _phoneNumber
  ) {
    this.creditCardNumber = _creditCardNumber;
    this.expirationDate = _expirationDate;
    this.CVV2 = _CVV2;
    this.email = _email;
    this.mobile = _mobile;
    this.phoneNumber = _phoneNumber;
  }

  isValidCreditCardNumber() {
    return luhn.validate(this.creditCardNumber);
  }
  isExpiredDate() {
    let today = new Date();
    return this.expirationDate < today;
  }
  isValidCVV2() {
    return this.CVV2.match(/^[0-9]{3, 4}$/).length > 0;
  }
  isValidEmail() {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(this.email.toLowerCase());
  }
  isValidMobileNumber() {
    return /^[+]?(1\-|1\s|1|\d{3}\-|\d{3}\s|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/g.test(
      this.isValidMobileNumber
    );
  }
  extractCountryCode(number) {
    let cleanNumber = number.replace(/[^0-9]$/, "");
    return this.getCountryCode(cleanNumber.slice(0, 4));
  }
  getCountryCode(code) {
    let codes = {
      234: "Nigeria",
    };
    return codes[code];
  }
}
