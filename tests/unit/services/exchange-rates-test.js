import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | exchange-rates', function(hooks) {
  setupTest(hooks);

  test('#fetchRates', async function(assert) {
    let service = this.owner.lookup('service:exchange-rates');
    await service.fetchRates();
    assert.equal(service.btceur, 9167.57, 'fetches BTCEUR from Bitstamp');
    assert.equal(service.btcusd, 10749.70, 'fetches BTCUSD from Bitstamp');
  });
});
