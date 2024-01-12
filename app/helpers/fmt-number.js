import { helper } from '@ember/component/helper';

export default helper(function fmtNumber(number) {
  const lang = navigator.language || navigator.userLanguage;
  return number.toLocaleString(lang);
});
