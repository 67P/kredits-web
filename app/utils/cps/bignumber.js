import { computed } from '@ember/object';
import ethers from 'ethers';

export default function(dependentKey, converterMethod) {
  return computed(dependentKey, {
    get () {
      let value = this.get(dependentKey);
      if (value && ethers.utils.BigNumber.isBigNumber(value)) {
        return value[converterMethod]();
      } else {
        return value;
      }
    },
    set (key, value) {
      const bnValue = ethers.utils.bigNumberify(value);
      this.set(dependentKey, bnValue);
      return bnValue[converterMethod]();
    }
  });
}
