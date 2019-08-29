import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | signup/eth-account', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:signup/eth-account');
    assert.ok(route);
  });
});
