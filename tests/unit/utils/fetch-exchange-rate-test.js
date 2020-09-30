import fetchExchangeRate from 'kredits-web/utils/fetch-exchange-rate';
import { module, test } from 'qunit';
import fetchMock from 'fetch-mock';

fetchMock.get('https://www.bitstamp.net/api/v2/ticker/btceur/', {
  "high": "9258.43", "last": "9165.14", "timestamp": "1601455909", "bid":
  "9159.93", "vwap": "9167.57", "volume": "1542.54764854", "low": "9080.20",
  "ask": "9165.14", "open": "9240.84"
});

fetchMock.get('https://www.bitstamp.net/api/v2/ticker/btcusd/', {
  "high": "10865.00", "last": "10714.62", "timestamp": "1601455914", "bid":
  "10711.31", "vwap": "10749.70", "volume": "4460.32091975", "low": "10636.66",
  "ask": "10715.99", "open": "10840.00"
});

module('Unit | Utility | fetch-exchange-rate', function() {
  test('it requires a currency pair', function(assert) {
    assert.throws(fetchExchangeRate);
  });

  test('it fetches BTCEUR from Bitstamp', async function(assert) {
    let result = await fetchExchangeRate('btceur');
    assert.equal(result, 9167.57, 'returns 24-hour volume-weighted average price');
  });

  test('it fetches BTCUSD from Bitstamp', async function(assert) {
    let result = await fetchExchangeRate('btcusd');
    assert.equal(result, 10749.70, 'returns 24-hour volume-weighted average price');
  });
});
