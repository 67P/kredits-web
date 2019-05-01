import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Helper | contribution-status', function (hooks) {
  setupTest(hooks);

  test('returns the appropriate status', function (assert) {
    const contributionStatus = this.owner.factoryFor('helper:contribution-status').create();
    const kredits = this.owner.lookup('service:kredits');

    kredits.set('currentBlock', 23000);

    const contributionUnconfirmed = { confirmedAt: 23001, vetoed: false };
    const contributionConfirmed   = { confirmedAt: 21000, vetoed: false };
    const contributionVetoed      = { confirmedAt: 23001, vetoed: true };

    assert.notOk(contributionStatus.compute([contributionUnconfirmed]), 'unconfirmed');
    assert.notOk(contributionStatus.compute([contributionVetoed]), 'vetoed');
    assert.ok(contributionStatus.compute([contributionConfirmed]), 'confirmed');
  });
});
