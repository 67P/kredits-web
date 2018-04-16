import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Contributor from 'kredits-web/models/contributor';

module('Unit | Model | contributor', function(hooks) {
  setupTest(hooks);

  test('#avatarURL() returns correct URL', function(assert) {
    let model = Contributor.create();
    model.set('github_uid', '318');

    assert.equal(model.get('avatarURL'), 'https://avatars2.githubusercontent.com/u/318?v=3&s=128');
  });
});
