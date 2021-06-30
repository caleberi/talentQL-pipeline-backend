const luhn = require("../algorithms/luhn.algorithm");
const { CreditCardType } = require("../algorithms/cardType.algorithm");
module.exports = {
  CreditCardDetails,
  CreditCardError,
};

class CreditCardError extends Error {
  constructor(...params) {
    super(errors, ...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CreditCardError);
    }
    this.name = "CreditCardError";
    this.date = new Date();
    this.error = errors;
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
    let parseDate =
      typeof this.expirationDate == "string"
        ? new Date(this.expirationDate)
        : false;
    if (parseDate) {
      let today = new Date();
      return this.expirationDate < today;
    }
    return parseDate;
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
    return /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/.test(
      this.isValidMobileNumber
    );
  }
  isValidPhoneNumber() {
    return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(
      this.phoneNumber
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
  getCardType(cc) {
    return CreditCardType(cc);
  }
  validate() {
    let errors = {};
    let cardType =
      this.isValidCreditCardNumber() &&
      this.getCardType(this.creditCardNumber) != undefined
        ? this.getCardType(this.creditCardNumber)
        : errors.push("Invalid / Unknown card type");
    let expireDate = this.isExpiredDate()
      ? true
      : errors.push("card has expired");
    let cvv = this.isValidCVV2() ? true : errors.push("Invalid CVV number ");
    let email = this.isValidEmail() ? true : errors.push("Invalid email");
    let mobile = this.isValidMobileNumber()
      ? true
      : errors.push("Invalid mobile number");
    let phone = this.isValidPhoneNumber()
      ? true
      : errors.push("Invalid phone number");
    let code = this.extractCountryCode(this.mobile);
    return {
      error: {
        valid: false,
        errors,
      },
      success: {
        valid: true,
        cvv,
        cardType,
        email,
        mobile,
        phone,
        code,
        expireDate,
      },
    };
  }
}
