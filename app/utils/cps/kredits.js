import { computed } from '@ember/object';
import ethers from 'ethers';
import formatKredits from 'kredits-web/utils/format-kredits';

export default function(dependentKey, options = {}) {
  return computed(dependentKey, {
    get () {
      const value = this.get(dependentKey);
      return formatKredits(value, options);
    },
    set (key, value) {
      const bnValue = ethers.utils.bigNumberify(value);
      this.set(dependentKey, bnValue);
      return formatKredits(bnValue, options);
    }
  });
}
