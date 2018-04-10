import EmberObject from 'ember-object';
import { alias } from 'ember-computed';
import bignumber from 'kredits-web/utils/cps/bignumber';

export default EmberObject.extend({
  // Contract
  id: bignumber('idRaw', 'toString'),
  creatorAddress: null,
  recipientId: bignumber('recipientIdRaw', 'toString'),
  amount: bignumber('amountRaw', 'toNumber'),
  votesCount: bignumber('votesCountRaw', 'toNumber'),
  votesNeeded: bignumber('votesNeededRaw', 'toNumber'),
  executed: null,
  ipfsHash: null,

  // Shortcuts
  isExecuted: alias('executed'),

  // IPFS
  kind: null,
  description: null,
  details: {},
  url: null,
  ipfsData: '',

  // Relationships
  contributor: null,
});
