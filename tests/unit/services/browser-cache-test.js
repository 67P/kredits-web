import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | browser-cache', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let service = this.owner.lookup('service:browser-cache');
    assert.ok(service);
  });

  test('creates kredits data stores', function(assert) {
    let cache = this.owner.lookup('service:browser-cache');
    assert.equal(cache.contributors._config.name, "kredits:contributors");
    assert.equal(cache.contributions._config.name, "kredits:contributions");
  });
});
