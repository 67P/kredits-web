import computed from 'ember-computed';
import EmberObject from 'ember-object';

export default EmberObject.extend({
  // Contract
  id: null,
  // TODO: Should we rename it to account like in the contract?
  address: null,
  balance: 0,
  isCore: false,
  ipfsHash: null,

  // IPFS
  kind: null,
  name: null,
  url: null,
  github_username: null,
  github_uid: null,
  wiki_username: null,
  ipfsData: '',

  // Deprecated
  isCurrentUser: false,

  avatarURL: computed('github_uid', function() {
    let github_uid = this.get('github_uid');
    if (github_uid) {
      return `https://avatars2.githubusercontent.com/u/${github_uid}?v=3&s=128`;
    }
  }),
});
