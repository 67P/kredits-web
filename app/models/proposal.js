import EmberObject from 'ember-object';

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

  // IPFS
  kind: null,
  description: null,
  details: {},
  url: null,
  ipfsData: '',

  // Deprecated
  recipientAddress: null,
  recipientName: null,
  recipientProfile: null,

  // TODO: add contributor relation
});
