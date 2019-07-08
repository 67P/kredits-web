import Helper from '@ember/component/helper';

export default Helper.extend({
  compute([string]) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
});
