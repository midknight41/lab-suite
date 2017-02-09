import * as urlMod from "url";
import * as mod from "object-mapper";

const objectMapper = mod;

export default class CheckVerify {

  constructor() {

    this.fastFailEnabled = false;
    this.currentCheck = null;
    this.checks = [];
    this.finalised = false;
  }

  check(field) {

    const err = this.stringTest_(field, "field");

    if (err !== null) {
      throw err;
    }

    this.finaliseChecks_();

    this.currentCheck = { field, tests: [], required: true };
    this.finalised = false;

    return this;
  }

  optional(field) {

    const err = this.stringTest_(field, "field");

    if (err !== null) {
      throw err;
    }

    this.finaliseChecks_();

    this.currentCheck = { field, tests: [], required: false };
    this.finalised = false;

    return this;
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

  array() {

    this.registerAndCheckFastFail_("array");
    return this;
  }

  object() {

    this.registerAndCheckFastFail_("object");
    return this;
  }

  function() {

    this.registerAndCheckFastFail_("function");
    return this;
  }

  number() {

    this.registerAndCheckFastFail_("number");
    return this;

  }

  boolean() {

    this.registerAndCheckFastFail_("boolean");
    return this;

  }

  string() {

    this.registerAndCheckFastFail_("string");
    return this;

  }

  url() {

    this.registerAndCheckFastFail_("url");
    return this;
  }

  date() {

    this.registerAndCheckFastFail_("date");
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

    for (const test of item.tests) {

      const value = objectMapper.getKeyValue(source, item.field); // source[item.field];

      // Only test required fields if the value isn't present
      if (item.required === false) {

        if (value === null || value === undefined) {
          continue;
        }

      }

      const error = this[`${test}Test_`](value, item.field);

      if (error !== null) {
        return error;

      }

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

    if (name) {
      message = `the parameter "${name}" is not ${testName}`;
    } else {
      message = `parameter is not ${testName}`;
    }

    return new Error(message);
  }

}

function validator() {
  return new CheckVerify();
}

module.exports.validator = validator;
