import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Contribution from 'kredits-web/models/contribution';

module('Unit | Helper | item-status', function (hooks) {
  setupTest(hooks);

  test('returns the appropriate status', function (assert) {
    const contributionStatus = this.owner.factoryFor('helper:item-status').create();
    const kredits = this.owner.lookup('service:kredits');

    kredits.set('currentBlock', 23000);

    const contributionUnconfirmed = Contribution.create({ confirmedAt: 23001, vetoed: false });
    const contributionConfirmed   = Contribution.create({ confirmedAt: 21000, vetoed: false });
    const contributionVetoed      = Contribution.create({ confirmedAt: 23001, vetoed: true });

    assert.equal(contributionStatus.compute([contributionUnconfirmed]), 'unconfirmed');
    assert.equal(contributionStatus.compute([contributionConfirmed]), 'confirmed');
    assert.equal(contributionStatus.compute([contributionVetoed]), 'vetoed');
  });
});
