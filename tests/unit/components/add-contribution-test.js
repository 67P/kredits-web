import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import moment from 'moment';

module('Unit | Component | add-contribution', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let component = this.owner.factoryFor('component:add-contribution').create();
    assert.ok(component);
  });

  test('default attributes', function(assert) {
    let component = this.owner.factoryFor('component:add-contribution').create();

    ['contributorId', 'kind', 'amount', 'description', 'url', 'details'].forEach(a => {
      assert.equal(component.attributes[a], null, `sets the default ${a} attribute`);
      assert.equal(component.get(a), null, `sets the ${a} property`);
    });

    assert.ok(moment.isDate(component.attributes.date), 'sets the default date attribute');
    assert.ok(moment.isDate(component.date), 'sets the default date');
  });

  test('override default attributes', function(assert) {
    let component = this.owner.factoryFor('component:add-contribution').create({
      attributes: { contributorId: '1' }
    });

    assert.equal(component.contributorId, '1', `overrides the default property`);

    ['kind', 'amount', 'description', 'url', 'details'].forEach(a => {
      assert.equal(component.attributes[a], null, `sets the default ${a} attribute`);
      assert.equal(component.get(a), null, `sets the ${a} property`);
    });

    assert.ok(moment.isDate(component.attributes.date), 'sets the default date attribute');
    assert.ok(moment.isDate(component.date), 'sets the default date');
  });

});
