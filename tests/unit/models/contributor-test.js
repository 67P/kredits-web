import { moduleFor, test } from 'ember-qunit';

moduleFor('model:contributor', 'Unit | Model | contributor');

test('avatarURL returns correct URL', function(assert) {
  let model = this.subject();
  model.set('github_uid', '318');
  assert.equal(model.get('avatarURL'), 'https://avatars2.githubusercontent.com/u/318?v=3&s=128');
});
