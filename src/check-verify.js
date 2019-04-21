const urlMod = require("url");
const {getValue} = require("map-factory");

class CheckVerify {

  constructor(suiteMode) {

    this.suiteMode = suiteMode ? suiteMode : true;
    this.fastFailEnabled = false;
    this.currentCheck = null;
    this.checks = [];
    this.finalised = false;

    const methods = ["string", "function", "number", "date", "object", "array", "error", "boolean", "url"];

    // map methodName to methods on CheckVerify
    for (const methodName of methods) {
      this[methodName] = () => {
        this.registerAndCheckFastFail_(methodName);
        return this;
      };
    }
  }

  check(field) {

    const err = this.stringTest_(field, "field");

    if (err !== null) {
      throw err;
    }

    this.finaliseChecks_();

    this.currentCheck = { field, tests: [], required: true, orMode: false };
    this.finalised = false;

    return this;
  }

  optional(field) {

    const err = this.stringTest_(field, "field");

    if (err !== null) {
      throw err;
    }

    this.finaliseChecks_();

    this.currentCheck = { field, tests: [], required: false, orMode: false };
    this.finalised = false;

    return this;
  }

  enableOrMode() {
    this.currentCheck.orMode = true;
  }

  verify(source) {

    this.finaliseChecks_();

    const error = this.execute_(source);

    if (error) {
      throw error;
    }

    return;

  }

  explain() {
    this.finaliseChecks_();

    return this.checks;
  }

  anything() {
    // doesn't do anything but allows the implementor to document the expectation
    return this;
  }

  registerAndCheckFastFail_(type) {

    this.checkStarted_();
    this.currentCheck.tests.push(type);

    if (this.fastFailEnabled) {
      const error = this.runTests_(this.source, this.currentCheck);

      if (error) {
        throw error;
      }
    }
  }

  finaliseChecks_() {

    if (this.currentCheck !== null && this.finalised !== true) this.checks.push(this.currentCheck);
    this.finalised = true;
  }

  execute_(source) {

    if (source === null || source === undefined || typeof source !== "object") {

      return new Error("source data must be an object to validate");

    }

    // execute all checks
    for (const item of this.checks) {

      const error = this.runTests_(source, item);

      if (error !== null) {
        return error;
      }

    }

  }

  get a() { return this; }
  get an() { return this; }
  get that() { return this; }
  get is() { return this; }

  runTests_(source, item) {

    const errors = [];

    for (const test of item.tests) {

      const value = getValue(source, item.field);

      // Only test required fields if the value isn't present
      if (item.required === false) {

        if (value === null || value === undefined) {
          continue;
        }

      }

      const error = this[`${test}Test_`](value, item.field);

      if (error !== null && item.orMode === false) {
        return error;
      }

      if (error !== null) {
        errors.push(error);
      }

    }

    // any non-conditional errors would've thrown by now
    return this.conditionalErrorChecks_(item, errors);

  }

  conditionalErrorChecks_(item, errors) {

    if (errors.length > 0 && errors.length === item.tests.length) {

      let errorMsg = "";

      for (const err of errors) {
        errorMsg += `${err.message} OR `;
      }

      errorMsg = errorMsg.replace(/The test suite expected /g, "");

      if (errorMsg.length > 4) {
        errorMsg = `The test suite expected ${errorMsg.substring(0, errorMsg.length - 4)}`;
      }

      return new Error(errorMsg);
    }

    return null;

  }

  objectTest_(object, name) {

    if (object === null || object === undefined || typeof object !== "object" || Array.isArray(object) === true || Object.prototype.toString.call(object) === "[object Date]") return this.generateError(name, "an object");
    return null;
  }

  functionTest_(object, name) {
    if (object === null || object === undefined || typeof object !== "function") return this.generateError(name, "a function");
    return null;
  }

  errorTest_(object, name) {
    if (object === null || object === undefined || object instanceof Error === false) return this.generateError(name, "an error");
    return null;
  }

  arrayTest_(object, name) {
    if (object === null || object === undefined || Array.isArray(object) === false) return this.generateError(name, "an array");
    return null;
  }

  numberTest_(value, name) {
    if (value === null || value === undefined || typeof value !== "number") return this.generateError(name, "a number");
    return null;
  }

  stringTest_(value, name) {
    if (value === null || value === undefined || value.length === 0 || typeof value !== "string") return this.generateError(name, "a populated string");
    return null;
  }

  booleanTest_(value, name) {
    if (value === null || value === undefined || typeof value !== "boolean") return this.generateError(name, "a boolean");
    return null;
  }

  urlTest_(value, name) {

    if (value === null || value === undefined || value.length === 0 || typeof value !== "string" || urlMod.parse(value).protocol === null || urlMod.parse(value).protocol.search(/(http|https):/) !== 0) {
      return this.generateError(name, "a url");
    }

    return null;

  }

  dateTest_(value, name) {

    if (value === null || value === undefined || Object.prototype.toString.call(value) !== "[object Date]") {
      return this.generateError(name, "a date");
    }

    return null;
  }

  checkStarted_() {
    if (this.currentCheck === null) throw new Error("The check method must be called first");
  }

  generateError(name, testName) {

    let message = "";

    if (this.suiteMode) {

      if (name) {
        message = `The test suite expected "${name}" to be ${testName}`;
      }

      return new Error(message);
    }

    // The test suite expected X to be a populated string
    if (name) {
      message = `the parameter "${name}" is not ${testName}`;
    } else {
      message = `parameter is not ${testName}`;
    }

    return new Error(message);


  }

}

function validator() {
  return new CheckVerify(false);
}

module.exports = {
  CheckVerify,
  validator
};
