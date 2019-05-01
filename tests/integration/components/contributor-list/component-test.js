import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import Contributor from 'kredits-web/models/contributor';

module('Integration | Component | contributor list', function(hooks) {
  setupRenderingTest(hooks);

  const toplist = [
    {
      contributor: Contributor.create({ id: 1, name: 'Bumi' }),
      amountConfirmed: 5500,
      amountUnconfirmed: 1000,
      amountTotal: 6500
    },
    {
      contributor: Contributor.create({ id: 2, name: 'Râu Cao' }),
      amountConfirmed: 1500,
      amountUnconfirmed: 2000,
      amountTotal: 3500
    }
  ];

  test('it renders unconfirmed kredits earned', async function(assert) {
    this.set('toplist', toplist);
    await render(hbs`{{contributor-list contributorList=toplist showUnconfirmedKredits=true}}`);

    assert.dom('tr:nth-child(1) td.person').hasText('Bumi');
    assert.dom('tr:nth-child(1) span.amount').hasText('6500');
    assert.dom('tr:nth-child(3) td.person').hasText('Râu Cao');
    assert.dom('tr:nth-child(3) span.amount').hasText('3500');
  });

  test('it renders confirmed kredits earned', async function(assert) {
    this.set('toplist', toplist);
    await render(hbs`{{contributor-list contributorList=toplist showUnconfirmedKredits=false}}`);

    assert.dom('tr:nth-child(1) td.person').hasText('Bumi');
    assert.dom('tr:nth-child(1) span.amount').hasText('5500');
    assert.dom('tr:nth-child(3) td.person').hasText('Râu Cao');
    assert.dom('tr:nth-child(3) span.amount').hasText('1500');
  });
});
