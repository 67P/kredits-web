import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:index', 'Unit | Controller | index');

let addFixtures = function(controller) {
  controller.set('model', { contributors: [
    { github_username: "neo", github_uid: "318", kredits: 10000 },
    { github_username: "morpheus", github_uid: "843", kredits: 15000 },
    { github_username: "mouse", github_uid: "842", kredits: 5000 },
  ]});
};

test('#contributorsCount returns number of contributors', function(assert) {
  let controller = this.subject();
  addFixtures(controller);

  assert.equal(controller.get('contributorsCount'), 3);
});

test('#kreditsSum returns the sum of all kredits', function(assert) {
  let controller = this.subject();
  addFixtures(controller);

  assert.equal(controller.get('kreditsSum'), 30000);
});
