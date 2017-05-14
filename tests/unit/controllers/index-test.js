import Ember from 'ember';
import Contributor from 'kredits-web/models/contributor';
import { moduleFor, test } from 'ember-qunit';

const {
  isPresent,
  isEmpty
} = Ember;

moduleFor('controller:index', 'Unit | Controller | index', {
  needs: ['service:ipfs', 'service:kredits']
});

let addFixtures = function(controller) {
  controller.set('model', {
    contributors: [],
    proposals: []
  });

  [
    { github_username: "neo", github_uid: "318", kredits: 10000 },
    { github_username: "morpheus", github_uid: "843", kredits: 15000 },
    { github_username: "trinity", github_uid: "123", kredits: 5000 },
    { github_username: "mouse", github_uid: "696", kredits: 0 }
  ].forEach(fixture => {
    controller.get('model.contributors').push(Contributor.create(fixture));
  });
};

test('doesn\'t contain people with 0 kredits', function(assert) {
  let controller = this.subject();
  addFixtures(controller);

  let contributorsSorted = controller.get('contributorsSorted');
  console.log(controller.get('contributorsSorted'));

  assert.ok(isPresent(contributorsSorted.findBy('github_username', 'neo')));
  assert.ok(isEmpty(contributorsSorted.findBy('github_username', 'mouse')));
});
