import { helper } from '@ember/component/helper';

export default helper(function fmtFiatCurrency(params) {
  const lang = navigator.language || navigator.userLanguage;
  const value = params[0];
  const currency = params[1] || 'EUR';

  if (currency === 'BTC') return `BTC ${value}`;

  const formatter = new Intl.NumberFormat(lang, {
    style: 'currency', currency, currencyDisplay: 'code'
  })

  return formatter.format(params[0]);
});
