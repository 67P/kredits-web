import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Helper | fmt-crypto-currency', function(hooks) {
  setupRenderingTest(hooks);

  test('it converts Wei to ETH', async function(assert) {
    this.set('balanceETH', '500000000000000000');
    await render(hbs`{{fmt-crypto-currency balanceETH "ETH"}}`);
    assert.equal(this.element.textContent.trim(), '0.5');
  });

  test('it converts Satoshis to (W)BTC', async function(assert) {
    this.set('balanceWBTC', '117214976');
    await render(hbs`{{fmt-crypto-currency balanceWBTC "WBTC"}}`);
    assert.equal(this.element.textContent.trim(), '1.17214976');
  });
});
