const {CheckVerify, validator} = require("./check-verify");

class ExpectProxy {

  constructor(variableName) {

    this.checker = new CheckVerify(); // For the proxy
    this.checker.check(variableName);
    this.buildProxy_();
  }

  buildProxy_() {

    const grammar = ["a", "an", "to", "be"];
    const methods = ["string", "function", "number", "date", "object", "array", "anything", "error", "boolean"];

    // build properties for the elements of grammar
    for (const propName of grammar) {

      Object.defineProperty(this, propName, {
        get: () => { return this; }
      });
    }

    Object.defineProperty(this, "or", {
      get: () => {
        this.checker.enableOrMode();
        return this;
      }
    });

    // map methodName to methods on CheckVerify
    for (const methodName of methods) {
      this[methodName] = () => {
        this.checker[methodName]();
        return this;
      };
    }
  }

  verify(variables) {

    validator()
      .check("variables").is.an.object()
      .verify({ variables });

    this.checker.verify(variables);
  }
}

module.exports = ExpectProxy;
