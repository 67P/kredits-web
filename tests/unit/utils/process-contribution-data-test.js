import { module, test } from 'qunit';
import processContributionData from 'kredits-web/utils/process-contribution-data';
import testData from '../../fixtures/contribution-data';

module('Unit | Utility | process-contribution-data', function() {

  test('formats the data correctly', function(assert) {
    const result = processContributionData(testData);

    assert.ok(typeof result.confirmedAt === 'number');
  });

  test('copies other properties', function(assert) {
    const result = processContributionData(testData);

    [
      'id', 'contributorId', 'amount', 'vetoed',
      'ipfsHash', 'kind', 'description',
      'url', 'date', 'time', 'pendingTx'
    ].forEach(p => {
      assert.ok(Object.prototype.hasOwnProperty.call(result, p), `copies property ${p}`);
    })
  });

  test('does not copy unnecessary properties', function(assert) {
    const result = processContributionData(testData);

    ['exists', '5'].forEach(p => {
      assert.notOk(Object.prototype.hasOwnProperty.call(result, p));
    })
  });

  test('includeDetails option', function(assert) {
    const result = processContributionData(testData, { includeDetails: true });

    assert.ok(Object.prototype.hasOwnProperty.call(result, 'details'), 'includes the details property/value');
  });

});
