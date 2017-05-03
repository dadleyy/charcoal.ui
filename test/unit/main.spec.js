const main = require("charcoal/main");

describe("application test suite", function() {

  it("be bootstrap-able", function() {
    expect(typeof main.bootstrap).toBe("function");
  });

});
