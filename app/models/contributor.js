import EmberObject from '@ember/object';

export default EmberObject.extend({
  // Contract
  id: null,
  account: null,
  balance: 0,
  totalKreditsEarned: 0,
  contributionsCount: 0,
  isCore: false,
  ipfsHash: null,

  // IPFS
  kind: null,
  name: null,
  url: null,
  github_username: null,
  github_uid: null,
  wiki_username: null,
  zoom_display_name: null,

  serialize() {
    return JSON.stringify(this);
  }
});
