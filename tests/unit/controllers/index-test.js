import { isEmpty, isPresent } from '@ember/utils';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Contributor from 'kredits-web/models/contributor';

module('Unit | Controller | index', function(hooks) {
  setupTest(hooks);

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
    let controller = this.owner.lookup('controller:index');
    addFixtures(controller);

    let contributorsSorted = controller.get('contributorsSorted');

    assert.ok(isPresent(contributorsSorted.findBy('github_username', 'neo')));
    assert.ok(isEmpty(contributorsSorted.findBy('github_username', 'mouse')));
  });
});
