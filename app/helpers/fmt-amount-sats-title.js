import { helper } from '@ember/component/helper';

export default helper(function fmtAmountSatsTitle(params) {
  const amountSats = params[0];

  if (typeof amountSats === 'number' && amountSats > 0) {
    return `${amountSats} sats`;
  } else {
    return '';
  }
});
