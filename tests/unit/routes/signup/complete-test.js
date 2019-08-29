import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | signup/complete', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:signup/complete');
    assert.ok(route);
  });
});
