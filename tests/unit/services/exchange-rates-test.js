import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import config from 'kredits-web/config/environment';
import fetchMock from 'fetch-mock';

const corsProxy = config.corsProxy;

fetchMock.get(`${corsProxy}https://www.bitstamp.net/api/v2/ticker/btceur/`, {
  "high": "9258.43", "last": "9165.14", "timestamp": "1601455909", "bid":
  "9159.93", "vwap": "9167.57", "volume": "1542.54764854", "low": "9080.20",
  "ask": "9165.14", "open": "9240.84"
});

fetchMock.get(`${corsProxy}https://www.bitstamp.net/api/v2/ticker/btcusd/`, {
  "high": "10865.00", "last": "10714.62", "timestamp": "1601455914", "bid":
  "10711.31", "vwap": "10749.70", "volume": "4460.32091975", "low": "10636.66",
  "ask": "10715.99", "open": "10840.00"
});

module('Unit | Service | exchange-rates', function(hooks) {
  setupTest(hooks);

  test('#fetchRates', async function(assert) {
    let service = this.owner.lookup('service:exchange-rates');
    await service.fetchRates();
    assert.equal(service.btceur, 9167.57, 'fetches BTCEUR from Bitstamp');
    assert.equal(service.btcusd, 10749.70, 'fetches BTCUSD from Bitstamp');
  });
});
