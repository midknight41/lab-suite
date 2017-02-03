export function declare(callback) {
  return new LabSuite(callback);
}

export class LabSuite {

  constructor(callback) {
    this.callback_ = callback;
  }

  run(lab, variables) {
    this.callback_(lab, variables);
  }
}
