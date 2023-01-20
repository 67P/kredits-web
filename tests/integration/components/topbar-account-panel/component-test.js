import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

function stubWalletApi () {
  window.ethereum = {
    on: function() { return true; },
    request: function() { return Promise.resolve(); }
  }
}

module('Integration | Component | topbar-account-panel', function(hooks) {
  setupRenderingTest(hooks);

  test('Unknown user without wallet', async function(assert) {
    await render(hbs`<TopbarAccountPanel />`);

    assert.ok(
      this.element.textContent.trim().match(/^Anonymous/),
      'shows current user as anonymous'
    );
    assert.equal(
      this.element.querySelectorAll('button#signup').length, 1,
      'signup button is visible'
    );
    assert.equal(
      this.element.querySelectorAll('button#connect').length, 0,
      'connect button is not visible'
    );
  });

  test('Unknown user with disconnected wallet', async function(assert) {
    stubWalletApi();
    let service = this.owner.lookup('service:kredits');
    service.set('currentUserAccounts', []);
    await render(hbs`<TopbarAccountPanel />`);

    assert.ok(
      this.element.textContent.trim().match(/^Anonymous/),
      'shows current user as anonymous'
    );
    assert.equal(
      this.element.querySelectorAll('button#signup').length, 1,
      'signup button is visible'
    );
    assert.equal(
      this.element.querySelectorAll('button#connect').length, 1,
      'connect button is visible'
    );
  });

  test('Unknown user with connected wallet', async function(assert) {
    stubWalletApi();
    let service = this.owner.lookup('service:kredits');
    service.set('currentUserAccounts', [{ foo: 'bar' }]);
    await render(hbs`<TopbarAccountPanel />`);

    assert.ok(
      this.element.textContent.trim().match(/^Anonymous/),
      'shows current user as anonymous'
    );
    assert.equal(
      this.element.querySelectorAll('button#signup').length, 1,
      'signup button is visible'
    );
    assert.equal(
      this.element.querySelectorAll('button#connect').length, 0,
      'connect button is not visible'
    );
  });

  test('Known contributor', async function(assert) {
    stubWalletApi();
    let service = this.owner.lookup('service:kredits');
    service.set('currentUserAccounts', [{ foo: 'bar' }]);
    service.set('currentUser', { name: 'Dorian Nakamoto', isCore: false });
    await render(hbs`<TopbarAccountPanel />`);

    assert.dom(this.element).hasText(
      'Dorian Nakamoto', 'shows current user\'s name'
    );
    assert.equal(
      this.element.querySelectorAll('button#signup').length, 0,
      'signup button is not visible'
    );
    assert.equal(
      this.element.querySelectorAll('button#connect').length, 0,
      'connect button is not visible'
    );
  });
});
