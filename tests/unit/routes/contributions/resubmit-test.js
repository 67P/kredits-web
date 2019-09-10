import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | contributions/resubmit', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:contributions/resubmit');
    assert.ok(route);
  });
});
