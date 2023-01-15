import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import createComponent from 'kredits-web/tests/helpers/create-component';
// import moment from 'moment';

module('Unit | Component | confirmed-in', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let component = createComponent('component:confirmed-in');
    assert.ok(component);
  });

  test('#confirmedInBlocks', function(assert) {
    const kredits = this.owner.lookup('service:kredits');
    kredits.set('currentBlock', 419550);
    let component = createComponent('component:confirmed-in');
    component.args.confirmedAtBlock = 420000;

    assert.equal(component.confirmedInBlocks, 450);
  })

  test('#confirmedInSeconds', function(assert) {
    const kredits = this.owner.lookup('service:kredits');
    kredits.set('currentBlock', 419550);
    let component = createComponent('component:confirmed-in');
    component.args.confirmedAtBlock = 420000;

    assert.equal(component.confirmedInSeconds, 13500);
  })

  test('#confirmedInHumanTime', function(assert) {
    const kredits = this.owner.lookup('service:kredits');
    kredits.set('currentBlock', 419550);
    let component = createComponent('component:confirmed-in');
    component.args.confirmedAtBlock = 420000;

    assert.equal(component.confirmedInHumanTime, '4 hours');
  })

  test('#isConfirmed', function(assert) {
    const kredits = this.owner.lookup('service:kredits');
    kredits.set('currentBlock', 430000);
    let component = createComponent('component:confirmed-in');
    component.args.confirmedAtBlock = 420000;

    assert.ok(component.isConfirmed);
  })
});
