import * as Code from "code";
import * as Lab from "lab";
import getHelper from "lab-testing";

const lab = exports.lab = Lab.script();
const expect = Code.expect;
const testing = getHelper(lab);
const group = testing.createExperiment("lab-suite");

import * as suite from "../lib/index.js";

group("The create() factory method", () => {

  lab.test("returns a LabSuite object", done => {

    const obj = suite.create();
    expect(obj).to.be.an.instanceOf(suite.LabSuite);

    return done();
  });

});

group("LabSuite", () => {

  let expected;
  let fakeLab;
  let mySuite;

  lab.beforeEach(done => {

    expected = { SERVICE_NAME: "Name1", SERVICE_PARAMS: [1, 2, 3] };
    fakeLab = {
      test: () => {
        return;
      }
    };

    mySuite = new suite.LabSuite();

    return done();

  });

  lab.test("calls a suite when one is provided", done => {

    mySuite.declare((innerLab, variables) => {

      expect(innerLab).to.equal(fakeLab);
      expect(variables).to.be.an.object();
      expect(variables).to.equal(expected);

      return done();
    });

    mySuite.run(fakeLab, expected);


  });

  lab.test("throws if run is called before declare", done => {

    const throws = function () {
      mySuite.run(fakeLab, expected);
    };

    expect(throws).to.throw(Error, /was not called/);

    return done();
  });

  lab.test("throws if run doesn't pass lab", done => {

    mySuite.declare(() => {

    });

    const throws = function () {
      mySuite.run(null, expected);
    };

    expect(throws).to.throw(Error, /must be provided/);

    return done();
  });

  lab.test("throws if run doesn't pass variables", done => {


    mySuite.declare(() => {

    });

    const throws = function () {
      mySuite.run(fakeLab, null);
    };

    expect(throws).to.throw(Error, /must be provided/);

    return done();
  });

  lab.test("throws if declare is not passed a function", done => {

    const throws = function () {
      mySuite.declare();
    };

    expect(throws).to.throw(Error, /must be provided/);

    return done();
  });

  lab.test("does not throw if an expectations are met", done => {

    mySuite.expect("SERVICE_NAME").to.be.a.string();
    mySuite.expect("SERVICE_PARAMS").to.be.an.array();

    mySuite.declare((innerLab, variables) => {

      expect(innerLab).to.equal(fakeLab);
      expect(variables).to.be.an.object();
      expect(variables).to.equal(expected);

      return done();
    });

    mySuite.run(fakeLab, expected);

  });

  lab.test("throws if the expectations are not met", done => {

    mySuite.expect("SERVICE_NAME").to.be.a.string();
    mySuite.expect("SERVICE_PARAMS").to.be.an.object();

    mySuite.declare(() => {

    });

    const throws = function () {
      mySuite.run(fakeLab, expected);
    };

    expect(throws).to.throw(Error, /not an object/);
    return done();

  });


});

