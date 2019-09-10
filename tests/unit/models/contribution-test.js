import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Contribution from 'kredits-web/models/contribution';

module('Unit | Model | contribution', function(hooks) {
  setupTest(hooks);

  test('iso8601Date', function(assert) {
    const model = Contribution.create({
      date: '2019-09-10'
    });
    assert.equal(model.iso8601Date, '2019-09-10');

    model.set('time',  '09:33:00.141Z');
    assert.equal(model.iso8601Date, '2019-09-10T09:33:00.141Z');
  });

  test('jsDate', function(assert) {
    const model = Contribution.create({
      date: '2019-09-10',
      time: '09:33:00.141Z'
    });

    assert.ok(model.jsDate instanceof Date);
    assert.equal(model.jsDate.toISOString(), '2019-09-10T09:33:00.141Z');
  });
});
