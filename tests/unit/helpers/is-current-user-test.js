import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Helper | is-current-user', function (hooks) {
  setupTest(hooks);

  test('should be true if the given contributor is the current user', function (assert) {
    const kredits = this.owner.lookup('service:kredits');
    const currentUser = {
      account: '0xD4264570B12dA659Ee4BBd41c3509B7b1F9c23AC'
    }
    kredits.set('currentUser', currentUser);

    const contributor = {
      account: '0xD4264570B12dA659Ee4BBd41c3509B7b1F9c23AC'
    }

    const isCurrentUser = this.owner.factoryFor('helper:is-current-user').create();

    assert.ok(isCurrentUser.compute([contributor]));
  });

  test('should be false if the given contributor is not the current user', function (assert) {
    const kredits = this.owner.lookup('service:kredits');
    const currentUser = {
      account: '0xD4264570B12dA659Ee4BBd41c3509B7b1F9c23AC'
    }
    kredits.set('currentUser', currentUser);

    const contributor = {
      account: '0xA4264570B12dA659Ee4BBd51c3509B7b1F9c23AC'
    }

    const isCurrentUser = this.owner.factoryFor('helper:is-current-user').create();

    assert.notOk(isCurrentUser.compute([contributor]));
  });
});
