const Code = require("code");
const Lab = require("lab");
const {"default": getHelper} = require("lab-testing");
const suite = require("../src/index.js");

const lab = exports.lab = Lab.script();
const expect = Code.expect;
const testing = getHelper(lab);
const group = testing.createExperiment("lab-suite");

group("The create() factory method", () => {

  lab.test("returns a LabSuite object", () => {

    const obj = suite.create();
    expect(obj).to.be.an.instanceOf(suite.LabSuite);
  });

});

group("Suite Interface", () => {

  let expected;
  let fakeLab;
  let mySuite;

  lab.beforeEach(() => {

    expected = {
      SERVICE_NAME: "Name1",
      SERVICE_PARAMS: [1, 2, 3],
      THROWN_ERROR: new Error("Failed")
    };

    fakeLab = {
      test: () => {
        return;
      }
    };

    mySuite = new suite.LabSuite();
  });

  lab.test("calls a suite when one is provided", () => {

    mySuite.declare((innerLab, variables) => {

      expect(innerLab).to.equal(fakeLab);
      expect(variables).to.be.an.object();
      expect(variables).to.equal(expected);
    });

    mySuite.run(fakeLab, expected);
  });

  lab.test("throws if run is called before declare", () => {

    const throws = function () {
      mySuite.run(fakeLab, expected);
    };

    expect(throws).to.throw(Error, /was not called/);
  });

  lab.test("throws if run doesn't pass lab", () => {

    mySuite.declare(() => {});

    const throws = function () {
      mySuite.run(null, expected);
    };

    expect(throws).to.throw(Error, /must be provided/);

  });

  lab.test("throws if run doesn't pass variables", () => {


    mySuite.declare(() => {});

    const throws = function () {
      mySuite.run(fakeLab, null);
    };

    expect(throws).to.throw(Error, /must be provided/);

  });

  lab.test("throws if declare is not passed a function", () => {

    const throws = function () {
      mySuite.declare();
    };

    expect(throws).to.throw(Error, /must be provided/);

  });

});

group("Exceptions", () => {

  let expected;
  let fakeLab;
  let mySuite;

  lab.beforeEach(() => {

    expected = {
      SERVICE_NAME: "Name1",
      SERVICE_PARAMS: [1, 2, 3],
      THROWN_ERROR: new Error("Failed")
    };

    fakeLab = {
      test: () => {
        return;
      }
    };

    mySuite = new suite.LabSuite();
  });

  lab.test("does not throw if expectations are met", () => {

    mySuite.expect("SERVICE_NAME").to.be.a.string();
    mySuite.expect("SERVICE_PARAMS").to.be.an.array();

    mySuite.declare((innerLab, variables) => {

      expect(innerLab).to.equal(fakeLab);
      expect(variables).to.be.an.object();
      expect(variables).to.equal(expected);
    });

    mySuite.run(fakeLab, expected);

  });

  lab.test("throws if the expectations are not met", () => {

    mySuite.expect("SERVICE_NAME").to.be.a.string();
    mySuite.expect("SERVICE_PARAMS").to.be.an.object();

    mySuite.declare(() => {

    });

    const throws = function () {
      mySuite.run(fakeLab, expected);
    };

    expect(throws).to.throw(Error, /an object/);
  });

  lab.test("The anything expectation has no adverse effect", () => {

    mySuite.expect("SERVICE_NAME").to.be.anything();

    mySuite.declare(() => {

    });

    mySuite.run(fakeLab, expected);
  });

  // Irony. This is pretty much what the lab-suite module does!
  [
    { name: "error", goodValue: new Error(), badValue: "not an error", message: "an error" },
    { name: "boolean", goodValue: true, badValue: "not a boolean", message: "a boolean" },
    { name: "string", goodValue: "this is good", badValue: 1234, message: "a populated string" },
    { name: "number", goodValue: 1244, badValue: "not a number", message: "a number" },
    { name: "date", goodValue: new Date(), badValue: "not a date", message: "a date" },
    { name: "array", goodValue: [1, 2, 3], badValue: "not an array", message: "an array" },
    { name: "object", goodValue: { message: "this is good" }, badValue: 1234, message: "an object" },
    { name: "number", goodValue: 1244, badValue: "not a number", message: "a number" },
    { name: "function", goodValue: () => { }, badValue: "not a function", message: "a function" }
  ]
    .map(({ goodValue, badValue, name, message }) => {

      lab.test(`The ${name} expectation does not throw if variable is ${message}`, () => {

        mySuite.expect("TEST_VALUE")[name]();

        mySuite.declare(() => {});

        mySuite.run(fakeLab, { "TEST_VALUE": goodValue });
      });

      lab.test(`The ${name} expectation throws if variable is not ${message}`, () => {

        mySuite.expect("TEST_VALUE")[name]();

        mySuite.declare(() => {

        });

        const throws = function () {
          mySuite.run(fakeLab, { TEST_VALUE: badValue });
        };

        expect(throws).to.throw(Error, new RegExp(message));
      });

    });
});

group("Conditional Expectations", () => {

  let fakeLab;
  let mySuite;

  lab.beforeEach(() => {

    fakeLab = {
      test: () => {
        return;
      }
    };

    mySuite = new suite.LabSuite();
  });

  lab.test("An or statement does not throw if the first expectation is met", () => {

    mySuite.expect("OBJECT_OR_ARRAY").to.be.an.object().or.an.array();

    const variables = { OBJECT_OR_ARRAY: { "Service": "Name1" } };

    mySuite.declare(() => {

    });

    mySuite.run(fakeLab, variables);
  });

  lab.test("An or statement does not throw if the second expectation is met", () => {

    mySuite.expect("OBJECT_OR_ARRAY").to.be.an.object().or.an.array();

    const variables = { OBJECT_OR_ARRAY: [1, 2, 3] };

    mySuite.declare(() => {

    });

    mySuite.run(fakeLab, variables);
  });

  lab.test("An or statement will throw when all expectations are not met", () => {

    mySuite.expect("OBJECT_OR_ARRAY").to.be.an.object().or.an.array();

    const variables = { OBJECT_OR_ARRAY: "Oh no a string!" };

    mySuite.declare(() => {});

    const throws = function () {
      mySuite.run(fakeLab, variables);
    };

    expect(throws).to.throw(Error, "The test suite expected \"OBJECT_OR_ARRAY\" to be an object OR \"OBJECT_OR_ARRAY\" to be an array");
  });

});
