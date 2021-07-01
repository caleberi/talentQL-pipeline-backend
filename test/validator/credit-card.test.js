const assert = require("assert").strict;
const luhn = require("../../algorithms/luhn.algorithm").validate;

function describe(description, cb) {
  try {
    cb();
    console.log("✔ " + description);
    return;
  } catch (e) {
    console.log("✖ " + e.toString());
    return;
  }
}

function it(description, cb) {
  try {
    console.log("\n\t---> " + description);
    cb();
    return;
  } catch (e) {
    console.log("✖ " + e.toString());
    return;
  }
}
describe("luhn", function () {
  describe("#validate()", function () {
    it("should accept valid Visa test number", function () {
      assert.ok(luhn("4012-8888-8888-1881"));
    });
    it("should accept valid MasterCard test number", function () {
      assert.ok(luhn("5105-1051-0510-5100"));
    });
    it("should accept valid Amex test number", function () {
      assert.ok(luhn("3714-496353-98431"));
    });
    it("should reject invalid numbers", function () {
      assert.equal(luhn("1234-5678-9101-2131"), false);
    });
  });
});
