import EmberObject from '@ember/object';
import bignumber from 'kredits-web/utils/cps/bignumber';
import kreditsValue from 'kredits-web/utils/cps/kredits';

export default EmberObject.extend({
  // Contract
  id: bignumber('idRaw', 'toString'),
  account: null,
  balance: kreditsValue('balanceRaw'),
  totalKreditsEarned: bignumber('totalKreditsEarnedRaw', 'toNumber'),
  contributionsCount: bignumber('contributionsCountRaw', 'toNumber'),
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
  ipfsData: ''

});
