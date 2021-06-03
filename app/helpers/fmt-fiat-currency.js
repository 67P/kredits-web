import { helper } from '@ember/component/helper';

export default helper(function fmtFiatCurrency(params) {
  const lang = navigator.language || navigator.userLanguage;
  const formatter = new Intl.NumberFormat(lang, {
    style: 'currency',
    currency: params[1] || 'EUR',
    currencyDisplay: 'code'
  })
  return formatter.format(params[0]);
});
