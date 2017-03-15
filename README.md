
# lab-suite

[![Build Status](https://travis-ci.org/midknight41/lab-suite.svg?branch=master)](https://travis-ci.org/midknight41/lab-suite) 

**lab-suite** is a simple tool to create reusable test suites. It's quite easy to get into a pattern of cutting and pasting existing tests and then manually replacing the things that have changed but this can be time consuming and create a real maintenance nightmare.

While it was created to work with [lab](https://www.npmjs.com/package/lab) it does not directly depend on it. In theory any testing framework can be used.

## Installation

```
npm install lab-suite -D
```

## Create a suite
To create a suite follow the example below.

You can also set the expectations for the usage of the suite to make it easier for someone to implement. These expectations will be checked when the suite is run.

```suite.expect``` currently supports the following expectations:

- string
- function
- number 
- date
- object
- array
- error
- boolean
- anything (This doesn't perform an actual check but it's good for documenting the intended use of the suite)

```js
import labSuite from "lab-suite";

const suite = labSuite.create();

// These expectations double as documentation for someone implementing the suite
suite.expect("SERVICE").to.be.a.function();
suite.expect("SERVICE_CALL").to.be.a.string();
suite.expect("SERVICE_INPUT").to.be.an.array();
suite.expect("SERVICE_RESULT").to.be.a.string();

suite.declare((lab, variables) => {

  const {
    SERVICE,
    SERVICE_CALL,
    SERVICE_INPUT,
    SERVICE_RESULT
  } = variables;

  lab.experiment(`The ${SERVICE_CALL} method`, () => {

    lab.test("succeeds when get called with good parameters", done => {

      const service = new SERVICE();

      return service[SERVICE_CALL](...SERVICE_INPUT)
        .then(result => {
          expect(result).to.equal(SERVICE_RESULT);
        });
    });
  });
});

export default suite;
```

## Run a suite

Import the suite into you test file and do away with boilerplate tests. You can still create normal too if the thing you are testing isn't generic.

```js

import serviceTestSuite from "./serviceTestSuite";
import ServiceA from "./ServiceA";
import ServiceB from "./ServiceB";

const variablesA = {
  SERVICE: ServiceA, 
  SERVICE_CALL: "addNumbers", 
  SERVICE_INPUT: [1,2], 
  SERVICE_RESULT: 3 
  };

const variablesB = {
  SERVICE: ServiceB, 
  SERVICE_CALL: "countCharacters", 
  SERVICE_INPUT: ["abc","def", "ghi"], 
  SERVICE_RESULT: 9 
  };

serviceTestSuite.run(lab, variablesA);
serviceTestSuite.run(lab, variablesB);

```
