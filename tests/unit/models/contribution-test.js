import { moduleFor, test } from 'ember-qunit';
// import schemas from 'npm:kosmos-schemas';
// import tv4 from 'npm:tv4';

moduleFor('model:contribution', 'Unit | Model | contribution', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
