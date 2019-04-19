import { computed } from '@ember/object';
import ethers from 'npm:ethers';
//import formatKredits from 'kredits-web/utils/format-kredits.js';

function formatKredits(value, options) {
  let etherValue = ethers.utils.formatEther(value);
  if (!options.decimals) {
    etherValue = parseInt(etherValue).toString();
  }
  return etherValue;
}

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
