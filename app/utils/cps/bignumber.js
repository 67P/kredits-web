import { computed } from '@ember/object';
import ethers from 'npm:ethers';

export default function(dependentKey, converterMethod) {
  return computed(dependentKey, {
    get () {
      return this.get(dependentKey)[converterMethod]();
    },
    set (key, value) {
      value = ethers.utils.bigNumberify(value);
      this.set(dependentKey, value);
      return value[converterMethod]();
    }
  });
}
