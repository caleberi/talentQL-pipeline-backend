const luhn = require("../algorithms/luhn.algorithm");
const { CreditCardType } = require("../algorithms/card-type.algorithm");
const findCountryByCode = require("../lib/county-codes.lib");

class CreditCardError extends Error {
  constructor(errors, ...params) {
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
    let [exMonth, exYear] = this.expirationDate.split("/");
    const today = new Date();
    const ed = new Date();
    ed.setFullYear(exYear, exMonth - 1, ed.getDate());
    return today < ed;
  }
  isValidCVV2() {
    return /^[0-9]{3,4}$/.exec(this.CVV2) != this.CVV2 ? false : true;
  }
  isValidEmail() {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(this.email.toLowerCase());
  }
  isValidMobileNumber() {
    let mobile = this.mobile.replace(/\+/g, "");
    return /^\d{10,14}$/.test(mobile);
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
    let countyCode = findCountryByCode(code);
    return countyCode ? countyCode : false;
  }
  getCardType(cc) {
    return CreditCardType(cc);
  }
  validate() {
    let errors = [];
    let cardNum = this.creditCardNumber.replace(/\-/g, "");
    let cardType =
      this.isValidCreditCardNumber() && this.getCardType(cardNum) != undefined
        ? this.getCardType(cardNum)
        : errors.push("Invalid / Unknown card type");
    let expireDate = this.isExpiredDate()
      ? false
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
        card: {
          cvv,
          cardType,
          email,
          mobile,
          phone,
          code,
          expireDate,
        },
      },
    };
  }
}

module.exports = {
  CreditCardDetails,
  CreditCardError,
};
