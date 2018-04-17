import { computed } from '@ember/object';
import EmberObject from '@ember/object';
import bignumber from 'kredits-web/utils/cps/bignumber';

export default EmberObject.extend({
  // Contract
  id: bignumber('idRaw', 'toString'),
  account: null,
  balance: bignumber('balanceRaw', 'toNumber'),
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
    let github_uid = this.github_uid;
    if (github_uid) {
      return `https://avatars2.githubusercontent.com/u/${github_uid}?v=3&s=128`;
    }
  }),
});
