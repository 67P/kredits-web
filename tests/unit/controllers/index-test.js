import Ember from 'ember';
import Contributor from 'kredits-web/models/contributor';
import { moduleFor, test } from 'ember-qunit';

const {
  isPresent,
  isEmpty
} = Ember;

moduleFor('controller:index', 'Unit | Controller | index', {
  needs: ['service:kredits']
});

let addFixtures = function(controller) {
  [
    { github_username: "neo", github_uid: "318", balance: 10000 },
    { github_username: "morpheus", github_uid: "843", balance: 15000 },
    { github_username: "trinity", github_uid: "123", balance: 5000 },
    { github_username: "mouse", github_uid: "696", balance: 0 }
  ].forEach(fixture => {
    controller.get('kredits.contributors').push(Contributor.create(fixture));
  });
};

test('doesn\'t contain people with 0 balance', function(assert) {
  let controller = this.subject();
  addFixtures(controller);

  let contributorsSorted = controller.get('contributorsSorted');

  assert.ok(isPresent(contributorsSorted.findBy('github_username', 'neo')));
  assert.ok(isEmpty(contributorsSorted.findBy('github_username', 'mouse')));
});
