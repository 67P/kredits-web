//
// Code from https://github.com/HeroicEric/ember-group-by (MIT licensed)
//
import { A } from '@ember/array';
import { isPresent } from '@ember/utils';

export default function groupBy (collection, property) {
  let groups = A();
  let items = collection;

  if (items) {
    items.forEach(function(item) {
      let value = item[property];
      let group = groups.findBy('value', value);

      if (isPresent(group)) {
        group.items.push(item);
      } else {
        group = { property: property, value: value, items: [item] };
        groups.push(group);
      }
    });
  }

  return groups;
}
