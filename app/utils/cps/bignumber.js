import computed from 'ember-computed';
import ethers from 'npm:ethers';

export default function(dependentKey, converterMethod) {
  return computed(dependentKey, {
    get () {
      let value = this.get(dependentKey);
      if (value) {
        return this.get(dependentKey)[converterMethod]();
      }
    },
    set (key, value) {
      value = ethers.utils.bigNumberify(value);
      this.set(dependentKey, value);
      return value[converterMethod]();
    }
  });
}
