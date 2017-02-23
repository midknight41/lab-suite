import { default as CheckVerify, validator } from "./check-verify";

export default class ExpectProxy {

  constructor(variableName) {

    this.checker = new CheckVerify(); // For the proxy
    this.checker.check(variableName);
    this.buildProxy_();

  }

  buildProxy_() {

    const grammar = ["a", "an", "to", "be"];
    const methods = ["string", "function", "number", "date", "object", "array", "anything"];

    // build properties for the elements of grammar
    for (const propName of grammar) {

      Object.defineProperty(this, propName, {
        get: () => { return this; }
      });

    }

    // map methodName to methods on CheckVerify
    for (const methodName of methods) {
      this[methodName] = () => {
        this.checker[methodName]();
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
