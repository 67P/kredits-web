import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Component | chart-contributions-by-type', function(hooks) {
  setupTest(hooks);

  let contributions = [
    { kind: 'dev'       , amount: 500  , vetoed: true },
    { kind: 'dev'       , amount: 1500 , vetoed: false },
    { kind: 'ops'       , amount: 1500 , vetoed: false },
    { kind: 'design'    , amount: 5000 , vetoed: false },
    { kind: 'ops'       , amount: 1500 , vetoed: false },
    { kind: 'dev'       , amount: 5000 , vetoed: false },
    { kind: 'community' , amount: 5000 , vetoed: false },
    { kind: 'docs'      , amount: 500  , vetoed: true },
    { kind: 'docs'      , amount: 500  , vetoed: false },
    { kind: 'special'   , amount: 9999 , vetoed: false },
    { kind: 'docs'      , amount: 500  , vetoed: false }
  ];

  test('#chartData', function(assert) {
    let component = this.owner.factoryFor('component:chart-contributions-by-type').create();
    component.set('contributions', contributions);

    let data = component.get('chartData');

    assert.deepEqual(
      data.labels,
      ['Community', 'Design', 'Development', 'Operations & Infrastructure', 'Documentation'],
      'returns the correct labels'
    );
    assert.deepEqual(
      data.datasets[0].data,
      [5000, 5000, 6500, 3000, 1000],
      'returns the correct kredit sums'
    );
  });
});
