import { floatToBtc, btcToSats, satsToBtc } from 'kredits-web/utils/btc-conversions';
import { module, test } from 'qunit';

module('Unit | Utility | btc-conversions', function() {
  test('floatToBtc', function(assert) {
    assert.equal(floatToBtc(0.001429007), 0.00142901);
  });

  test('btcToSats', function(assert) {
    assert.equal(btcToSats(0.001429007), 142901);
  });

  test('satsToBtc', function(assert) {
    assert.equal(satsToBtc(142901), 0.00142901);
  });
});
