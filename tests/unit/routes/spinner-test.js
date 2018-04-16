import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | spinner', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:spinner');
    assert.ok(route);
  });
});
