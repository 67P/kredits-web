import { moduleFor, test } from 'ember-qunit';
import schemas from 'npm:kosmos-schemas';
import tv4 from 'npm:tv4';

moduleFor('model:contributor', 'Unit | Model | contributor');

test('#avatarURL() returns correct URL', function(assert) {
  let model = this.subject();
  model.set('github_uid', '318');

  assert.equal(model.get('avatarURL'), 'https://avatars2.githubusercontent.com/u/318?v=3&s=128');
});

test('#toJSON() returns a valid JSON-LD representation of the model', function(assert) {
  let model = this.subject();

  model.setProperties({
    name: 'Satoshi Nakamoto',
    kind: 'person',
    github_uid: 123,
    github_username: 'therealsatoshi',
    wiki_username: 'Satoshi',
  });

  assert.ok(tv4.validate(model.toJSON(), schemas['contributor']));
});
