import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Helper | fmt-fiat-currency', function(hooks) {
  setupRenderingTest(hooks);

  test('it returns the number formatted as currency', async function(assert) {
    this.set('amount', 13.9);

    await render(hbs`{{fmt-fiat-currency this.amount}}`);
    assert.ok(this.element.textContent.trim().match(/13.90/),
              'formats the number with two decimals');
    assert.ok(this.element.textContent.trim().match(/EUR/),
              'using EUR by default');

    await render(hbs`{{fmt-fiat-currency this.amount 'USD'}}`);
    assert.ok(this.element.textContent.trim().match(/USD/),
              'using defined currency when given');
  });
});
