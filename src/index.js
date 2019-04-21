const assert = require("assert");
const ExpectProxy = require("./expect-proxy");
const {validator} = require("./check-verify");

class LabSuite {

  constructor() {
    this.expectations = [];
  }

  run(lab, variables) {

    assert(this.callback_, "The declare method was not called before running the suite.");
    assert(lab, "An instance of lab must be provided to run the suite.");
    assert(variables, "The appropriate variables must be provided to run the suite.");

    for (const expectation of this.expectations) {
      expectation.verify(variables);
    }

    this.callback_(lab, variables);
  }

  declare(callback) {

    assert(typeof callback === "function", "A function must be provided with signature === (lab, variable)");

    this.callback_ = callback;
  }

  expect(variableName) {

    validator()
      .check("variableName").is.a.string()
      .verify({ variableName });

    const expectation = new ExpectProxy(variableName);
    this.expectations.push(expectation);
    return expectation;
  }
}

function create() {
  return new LabSuite();
}

module.exports = {create, LabSuite};
