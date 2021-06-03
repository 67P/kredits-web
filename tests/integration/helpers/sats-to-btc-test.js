import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Helper | sats-to-btc', function(hooks) {
  setupRenderingTest(hooks);

  test('it converts satoshis to full BTC amounts', async function(assert) {
    this.set('amount', '166800');

    await render(hbs`{{sats-to-btc this.amount}}`);

    assert.equal(this.element.textContent.trim(), '0.001668');
  });
});
