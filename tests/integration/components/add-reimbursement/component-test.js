import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, fillIn, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import contributors from '../../../fixtures/contributors';

module('Integration | Component | add-reimbursement', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    let kredits = this.owner.lookup('service:kredits');
    kredits.set('contributors', contributors);
    kredits.set('currentUser', contributors.findBy('id', 3));
  });

  test('Contributor select menu', async function(assert) {
    await render(hbs`<AddReimbursement />`);

    assert.equal(this.element.querySelectorAll('select#contributor option').length, contributors.length,
      'contains correct amount of items');

    assert.equal(this.element.querySelector('select#contributor option:checked').value, "3",
      'preselects the connected contributor account');
  });

  test('Adding expense items', async function(assert) {
    await render(hbs`<AddReimbursement />`);

    assert.dom(this.element).includesText('New expense item');

    await fillIn('form input[name="expense-amount"]', '49');
    await fillIn('form input[name="expense-title"]', 'Domain kosmos.org (yearly fee)');
    await click('form#add-expense-item input[type="submit"]');

    assert.equal(this.element.querySelector('input[name="total-eur"]').value, '49',
      'updates the total EUR amount');
    assert.equal(this.element.querySelector('input[name="total-usd"]').value, '0',
      'does not update the total USD amount');
    assert.equal(this.element.querySelector('input[name="total-btc"]').value, '0.00534493',
      'updates the total BTC amount');

    assert.dom(this.element).doesNotIncludeText('New expense item');

    await click('button#add-another-item');

    await fillIn('form input[name="expense-amount"]', '29');
    await fillIn('select[name="expense-currency"]', 'USD');
    await fillIn('form input[name="expense-title"]', 'Domain kosmos.social (yearly fee)');
    await click('form#add-expense-item input[type="submit"]');

    assert.equal(this.element.querySelector('input[name="total-usd"]').value, '29',
      'updates the total USD amount');
    assert.equal(this.element.querySelector('input[name="total-eur"]').value, '49',
      'does not update the total EUR amount');
    assert.equal(this.element.querySelector('input[name="total-btc"]').value, '0.00804268',
      'updates the total BTC amount');
  });
});
