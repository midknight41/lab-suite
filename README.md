
# lab-suite
Simple to create reusable lab test suites.

## Installation

```
npm install lab-suite -D
```

## Create a suite

```js

import * as suite from "lab-suite";

export default suite.declare((lab, variables) => {

  const {
    SERVICE,
    SERVICE_CALL,
    SERVICE_INPUT,
    SERVICE_RESULT} = variables;

  lab.experiment(`The ${SERVICE_CALL} method`, () => {

    lab.test("succeed when get called with good parameters", done => {

      const service = new SERVICE();

      return service[SERVICE_CALL](...SERVICE_INPUT)
        .then(result => {
          expect(result).to.equal(SERVICE_RESULT);
        });
    });
  });
});

```

## Use the suite to do away with boilerplate tests

```js

import serviceTestSuite from "./serviceTestSuite";

const serviceA = {
  SERVICE: ServiceA, 
  SERVICE_CALL: "addNumbers", 
  SERVICE_INPUT: [1,2], 
  SERVICE_RESULT: 3 
  };

const serviceB = {
  SERVICE: ServiceB, 
  SERVICE_CALL: "countCharacters", 
  SERVICE_INPUT: ["abc","def", "ghi"], 
  SERVICE_RESULT: 9 
  };

serviceTestSuite.run(lab, serviceA);
serviceTestSuite.run(lab, serviceB);


```
