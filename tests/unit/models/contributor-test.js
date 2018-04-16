import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import { run } from '@ember/runloop';

module('Unit | Model | contributor', function(hooks) {
  setupTest(hooks);

  test('#avatarURL() returns correct URL', function(assert) {
    let model = run(() => this.owner.lookup('service:store').createRecord('contributor'));
    model.set('github_uid', '318');

    assert.equal(model.get('avatarURL'), 'https://avatars2.githubusercontent.com/u/318?v=3&s=128');
  });
});
