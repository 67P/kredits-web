import { isEmpty } from '@ember/utils';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Contributor from 'kredits-web/models/contributor';

module('Unit | Controller | Dashboard', function(hooks) {
  setupTest(hooks);

  let addFixtures = function(controller) {
    [
      { github_username: "neo", github_uid: "318", totalKreditsEarned: 10000 },
      { github_username: "morpheus", github_uid: "843", totalKreditsEarned: 15000 },
      { github_username: "trinity", github_uid: "123", totalKreditsEarned: 5000 },
      { github_username: "mouse", github_uid: "696", totalKreditsEarned: 0 }
    ].forEach(fixture => {
      controller.get('kredits.contributors').push(Contributor.create(fixture));
    });
  };

  test('doesn\'t contain people with 0 balance', function(assert) {
    const controller = this.owner.lookup('controller:dashboard');
    addFixtures(controller);

    const kreditsToplistSorted = controller.get('kreditsToplistSorted');

    assert.equal(kreditsToplistSorted.length, 3,
      'kreditsToplist contains all contributors with kredits');
    assert.ok(isEmpty(kreditsToplistSorted.findBy('github_username', 'mouse')),
      'kreditsToplist does not contain contributors with 0 kredits');
  });
});
