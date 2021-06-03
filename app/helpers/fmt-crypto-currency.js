import { helper } from '@ember/component/helper';

export default helper(function fmtCryptoCurrency(params/*, hash*/) {
  let fmtAmount;
  const amount = params[0];
  const code = params[1];

  switch(code) {
    case 'ETH':
      fmtAmount = amount / 1000000000000000000;
      break;
    case 'WBTC':
      fmtAmount = amount / 100000000;
      break;
  }

  return fmtAmount;
});
