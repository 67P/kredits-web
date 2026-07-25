import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import contributors from '../../fixtures/contributors';
import contributions from '../../fixtures/contributions';
import ContributionModel from 'kredits-web/models/contribution';
import processContributionData from 'kredits-web/utils/process-contribution-data';

module('Unit | Service | kredits', function(hooks) {
  setupTest(hooks);

  test('#contributionsConfirmed', function(assert) {
    let service = this.owner.lookup('service:kredits');
    service.set('contributions', contributions);
    service.set('currentBlock', 1023);

    const items = service.contributionsConfirmed;
    assert.equal(items.length, 5);
  });

  test('#contributionsUnconfirmed', function(assert) {
    let service = this.owner.lookup('service:kredits');
    service.set('contributions', contributions);
    service.set('currentBlock', 1023);

    const items = service.contributionsUnconfirmed;
    assert.equal(items.length, 3);
  });

  test('#kreditsByContributor', function(assert) {
    let service = this.owner.lookup('service:kredits');
    service.set('contributors', contributors);
    service.set('contributions', contributions);
    service.set('currentBlock', 1023);

    const kreditsByContributor = service.kreditsByContributor;

    assert.equal(kreditsByContributor.length, 3, 'includes all contributors with confirmed kredits');

    const c1 = kreditsByContributor.find(k => k.contributor.id == 1);
    assert.equal(c1.amountConfirmed, 11500, 'correct amount confirmed');
    assert.equal(c1.amountUnconfirmed, 1500, 'correct amount unconfirmed');
    assert.equal(c1.amountTotal, 13000, 'correct amount total');

    const c2 = kreditsByContributor.find(k => k.contributor.id == 2);
    assert.equal(c2.amountConfirmed, 3000, 'correct amount confirmed');
    assert.equal(c2.amountUnconfirmed, 0, 'correct amount unconfirmed');
    assert.equal(c2.amountTotal, 3000, 'correct amount total');

    const c3 = kreditsByContributor.find(k => k.contributor.id == 3);
    assert.equal(c3.amountConfirmed, 0, 'correct amount confirmed');
    assert.equal(c3.amountUnconfirmed, 5000, 'correct amount unconfirmed');
    assert.equal(c3.amountTotal, 5000, 'correct amount total');
  });

  test('#contributorsSorted', function(assert) {
    let service = this.owner.lookup('service:kredits');
    service.set('contributors', contributors);

    assert.ok(service.contributorsSorted instanceof Array, 'is an array');
    assert.equal(service.contributorsSorted[1].name, 'Manuel', 'sorts by name');
  });

  test('#kreditsByContributor ignores unconfirmed contributions for contributors that are not loaded', function(assert) {
    let service = this.owner.lookup('service:kredits');
    service.set('contributors', contributors);

    // Contribution referencing a contributor that is not in the contributors
    // collection (e.g. its IPFS profile failed to deserialize). The dashboard
    // must not throw when computing the toplist.
    const orphanAttrs = { id: 99, contributorId: 999, confirmedAt: 2000, claimed: false, vetoed: false, amount: 7000, kind: 'dev' };
    const orphan = ContributionModel.create(processContributionData(orphanAttrs));
    orphan.set('contributor', undefined);

    service.set('contributions', [...contributions, orphan]);
    service.set('currentBlock', 1023);

    let kreditsByContributor;
    try {
      kreditsByContributor = service.kreditsByContributor;
    } catch (e) {
      assert.ok(false, `did not expect kreditsByContributor to throw: ${e.message}`);
      return;
    }

    assert.ok(kreditsByContributor, 'computes without throwing');
    assert.notOk(kreditsByContributor.findBy('contributor', undefined),
      'no entry for the missing contributor');
    assert.notOk(kreditsByContributor.find(k => k.contributor && k.contributor.id === 999),
      'orphan contributor id is absent from the toplist');
  });
});
