const toDigit = (numString) =>
  numString
    .replace(/[^0-9]/g, "")
    .split("")
    .map(Number);

const transform = (predicate, value, fn) => {
  if (predicate) {
    return fn(value);
  } else {
    return value;
  }
};

const doublingFunction = (current, idx) =>
  transform(idx % 2 === 0, current, (x) => x * 2);

const reduceMultipleDigitValue = (current) =>
  transform(current > 9, current, (x) => x - 9);

const luhn = {};

luhn.validate = (numString) => {
  const digits = toDigit(numString);
  const len = digits.length;
  const luhn_digit = digits[len - 1];

  const total = digits
    .slice(0, -1)
    .reverse()
    .map(doublingFunction)
    .map(reduceMultipleDigitValue)
    .reduce((current, accumulator) => current + accumulator, luhn_digit);

  return total % 10 === 0;
};

module.exports = luhn;
