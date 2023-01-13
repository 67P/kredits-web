import { helper } from '@ember/component/helper';
import getLocale from 'kredits-web/utils/get-locale';

export default helper(function(dateStr) {
  const date = new Date(dateStr);
  const locale = getLocale();
  return new Intl.DateTimeFormat(locale).format(date);
});
