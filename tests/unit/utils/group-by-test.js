//
// Code adapted from https://github.com/HeroicEric/ember-group-by (MIT licensed)
//
import { A } from '@ember/array';
import { module, test } from 'qunit';
import groupBy from 'kredits-web/utils/group-by';

module('Unit | Utils | group-by');

let car1 = { name: 'Carrera', color: 'red' };
let car2 = { name: 'Veyron', color: 'red' };
let car3 = { name: 'Corvette', color: 'blue' };
let car4 = { name: 'Viper', color: 'blue' };
let car5 = { name: 'Cobra', color: 'green' };
let cars = A([car1, car2, car3, car4, car5]);

test('it groups cars by color', function(assert) {
  assert.expect(1);
  let redGroup = { property: 'color', value: 'red', items: [car1, car2] };
  let blueGroup = { property: 'color', value: 'blue', items: [car3, car4] };
  let greenGroup = { property: 'color', value: 'green', items: [car5] };

  let result = groupBy(cars, 'color');
  let expected = [redGroup, blueGroup, greenGroup];

  assert.deepEqual(result, expected);
});

test('it does not fail with empty array', function(assert) {
  let cars = [];

  let result = groupBy(cars, 'color');
  assert.deepEqual(result, []);
});

test('it does not failkwith null', function(assert) {
  let cars = null;

  let result = groupBy(cars, 'color');
  assert.deepEqual(result, []);
});
