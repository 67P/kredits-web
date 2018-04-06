import computed from 'ember-computed';
import EmberObject from 'ember-object';

export default EmberObject.extend({
  id: null,
  address: null,
  name: null,
  kind: null,
  url: null,
  github_username: null,
  github_uid: null,
  wiki_username: null,
  profileHash: null,
  balance: null,
  isCore: false,
  isCurrentUser: false,

  avatarURL: computed('github_uid', function() {
    let github_uid = this.get('github_uid');
    if (github_uid) {
      return `https://avatars2.githubusercontent.com/u/${github_uid}?v=3&s=128`;
    }
  }),
});
