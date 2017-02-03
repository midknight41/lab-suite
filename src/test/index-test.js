import * as Code from "code";
import * as Lab from "lab";
import getHelper from "lab-testing";
import * as sinon from "sinon";

const lab = exports.lab = Lab.script();
const expect = Code.expect;
const testing = getHelper(lab);
const group = testing.createExperiment("lab-suite");

import * as suite from "../lib/index.js";

group("The declare() function", () => {

  lab.test("returns a LabSuite object.", done => {

    const obj = suite.declare((lab, variables) => {

    });

    expect(obj).to.be.an.instanceOf(suite.LabSuite);

    return done();
  });

});

group("LabSuite", () => {

  lab.test("calls a suite when one is provided.", done => {

    const expected = { a: "a", b: "b" };
    const fakeLab = {test: function() {return; }};

    const obj = suite.declare((innerLab, variables) => {

      expect(innerLab).to.equal(fakeLab);
      expect(variables).to.be.an.object();

      return done();
    });

    obj.run(fakeLab, expected);


  });

});

