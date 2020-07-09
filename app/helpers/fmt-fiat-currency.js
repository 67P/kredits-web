import { helper } from '@ember/component/helper';

export default helper(function fmtFiatCurrency(params) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: params[1] || 'EUR',
    minimumFractionDigits: 2
  })
  return formatter.format(params[0]);
});
