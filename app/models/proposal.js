import Ember from 'ember';

export default Ember.Object.extend({

  id: null,
  creatorAddress: null,
  recipientAddress: null,
  recipientName: null,
  votesCount: null,
  votesNeeded: null,
  amount: null,
  executed: null,
  url: null,
  ipfsHash: null

});
