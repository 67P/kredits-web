import isValidAmount from 'kredits-web/utils/is-valid-amount';
import { module, test } from 'qunit';

module('Unit | Utility | is-valid-amount', function() {
  test('it returns true for valid amounts', function(assert) {
    assert.ok(isValidAmount('1'));
    assert.ok(isValidAmount('1.0'));
    assert.ok(isValidAmount('0.3'));
    assert.ok(isValidAmount('0.3333923'));
    assert.ok(isValidAmount(1));
    assert.ok(isValidAmount(1.0));
    assert.ok(isValidAmount(0.3));
    assert.ok(isValidAmount(0.3333923));
  });

  test('it returns false for invalid amounts', function(assert) {
    assert.notOk(isValidAmount('0'));
    assert.notOk(isValidAmount(0));
    assert.notOk(isValidAmount(''));
    assert.notOk(isValidAmount('foo'));
  });
});
