import EmberObject from 'ember-object';
import { alias } from 'ember-computed';

export default EmberObject.extend({
  // Contract
  id: null,
  creatorAddress: null,
  recipientId: null,
  amount: null,
  votesCount: null,
  votesNeeded: null,
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
