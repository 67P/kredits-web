export default class Base {
  constructor(contract) {
    this.contract = contract;
  }

  get functions() {
    return this.contract.functions;
  }

  on(type, callback) {
    let eventMethod = `on${type.toLowerCase()}`;
    // Don't use this.contract.events here. Seems to be a bug in ethers.js
    this.contract[eventMethod] = callback;

    return this;
  }
}
