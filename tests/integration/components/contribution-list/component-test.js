import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, fillIn, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import contributors from '../../../fixtures/contributors';
import contributions from '../../../fixtures/contributions';

module('Integration | Component | contribution-list', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders all contributions', async function(assert) {
    this.set('fixtures', contributions);
    await render(hbs`{{contribution-list contributions=fixtures}}`);

    assert.equal(this.element.querySelectorAll('li').length, 9);
  });

  test('it renders filtered contributions', async function(assert) {
    let service = this.owner.lookup('service:kredits');
    service.set('contributors', contributors);

    this.set('fixtures', contributions);
    await render(hbs`{{contribution-list contributions=fixtures showQuickFilter=true}}`);

    await fillIn('.filter-contributor select', '1');
    assert.equal(this.element.querySelectorAll('li').length, 5, 'select contributor');

    await click('.filter-contribution-size input');
    assert.equal(this.element.querySelectorAll('li').length, 4, 'hide small contributions');
  });
});
