import computed from 'ember-computed';

export default function(dependentKey, converterMethod) {
  return computed(dependentKey, {
    get () {
      return this.get(dependentKey)[converterMethod]();
    },
    set (key, value) {
      this.set(dependentKey, value);
      return value[converterMethod]();
    }
  });
}
