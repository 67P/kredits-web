import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import contributors from '../../../fixtures/contributors';

module('Integration | Component | add-reimbursement', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function(assert) {
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
    await render(hbs`<AddReimbursement />`);
    assert.ok(true);
  });
});
