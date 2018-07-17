import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Component | chart-contributions-by-type', function(hooks) {
  setupTest(hooks);

  let proposals = [
    { kind: 'dev', amount: 500 },
    { kind: 'dev', amount: 1500 },
    { kind: 'ops', amount: 1500 },
    { kind: 'design', amount: 5000 },
    { kind: 'ops', amount: 1500 },
    { kind: 'dev', amount: 5000 },
    { kind: 'community', amount: 5000 },
    { kind: 'docs', amount: 500 },
    { kind: 'docs', amount: 500 },
    { kind: 'docs', amount: 500 },
  ];

  test('#chartData', function(assert) {
    let component = this.owner.factoryFor('component:chart-contributions-by-type').create();
    component.set('contributions', proposals);

    let data = component.get('chartData');

    assert.deepEqual(
      data.labels,
      ['Community', 'Design', 'Development', 'Operations & Infrastructure', 'Documentation'],
      'returns the correct labels'
    );
    assert.deepEqual(
      data.datasets[0].data,
      [5000, 5000, 7000, 3000, 1500],
      'returns the correct kredit sums'
    );
  });
});
