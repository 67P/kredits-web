import { helper } from '@ember/component/helper';

export default helper(function satsToBtc(amount/*, hash*/) {
  return amount / 100000000;
});
