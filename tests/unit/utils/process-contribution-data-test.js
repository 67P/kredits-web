import { module, test } from 'qunit';
import processContributionData from 'kredits-web/utils/process-contribution-data';
import testData from '../../fixtures/contribution-data';

module('Unit | Utility | process-contribution-data', function() {

  let result = processContributionData(testData);

  test('formats the data correctly', function(assert) {
    assert.ok(typeof result.confirmedAt === 'number');
  });

  test('copies other properties', function(assert) {
    [
      'id', 'contributorId', 'amount', 'vetoed',
      'ipfsHash', 'kind', 'description', 'details',
      'url', 'date', 'time', 'pendingTx'
    ].forEach(p => {
      assert.ok(Object.prototype.hasOwnProperty.call(result, p), `copies property ${p}`);
    })
  });

  test('does not copy unnecessary properties', function(assert) {
    ['exists', '5'].forEach(p => {
      assert.notOk(Object.prototype.hasOwnProperty.call(result, p));
    })
  });
});
