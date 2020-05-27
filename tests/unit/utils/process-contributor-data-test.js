import { module, test } from 'qunit';
import processContributorData from 'kredits-web/utils/process-contributor-data';
import testData from '../../fixtures/contributor-data';

module('Unit | Utility | process-contributor-data', function() {

  let result = processContributorData(testData);

  test('formats the data correctly', function(assert) {
    // TODO use integers everywhere for IDs
    assert.ok(typeof result.id == 'string');
    assert.ok(typeof result.balance == 'number');
    assert.ok(typeof result.totalKreditsEarned == 'number');
    assert.ok(typeof result.contributionsCount == 'number');
  });

  test('copies other properties', function(assert) {
    [
      'account', 'accounts', 'ipfsHash', 'isCore', 'kind', 'name', 'url',
      'github_username', 'github_uid', 'wiki_username', 'zoom_display_name'
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
