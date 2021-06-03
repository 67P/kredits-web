import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | budget/expenses', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:budget/expenses');
    assert.ok(route);
  });
});
