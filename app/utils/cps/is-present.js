import computed from 'ember-computed';
import { isPresent } from 'ember-utils';

export default function(key) {
  return computed(key, function() {
    return isPresent(this.get(key));
  });
}
