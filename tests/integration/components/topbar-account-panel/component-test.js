import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | topbar-account-panel', function(hooks) {
  setupRenderingTest(hooks);

  test('unknown user without wallet (or no permission to get wallet/account info)', async function(assert) {
    await render(hbs`<TopbarAccountPanel />`);

    assert.ok(this.element.textContent.trim().match(/^Anonymous/));
  });

  test('unknown user with Ethereum wallet', async function(assert) {
    let service = this.owner.lookup('service:kredits');
    service.set('currentUserAccounts', [{ foo: 'bar' }]);
    await render(hbs`<TopbarAccountPanel />`);

    assert.ok(this.element.textContent.trim().match(/^Anonymous/));
  });

  test('known contributor', async function(assert) {
    let service = this.owner.lookup('service:kredits');
    service.set('currentUserAccounts', [{ foo: 'bar' }]);
    service.set('currentUser', {
      name: 'Dorian Nakamoto',
      isCore: false
    });
    await render(hbs`<TopbarAccountPanel />`);

    assert.equal(this.element.textContent.trim(), 'Dorian Nakamoto');

    service.set('currentUser.isCore', true);
    await render(hbs`<TopbarAccountPanel />`);

    assert.equal(this.element.querySelectorAll('span.core-flag').length, 1);
  });
});
