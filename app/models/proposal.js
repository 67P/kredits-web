import Ember from 'ember';

export default Ember.Object.extend({

  id: null,
  creator: null,
  recipient: null,
  votesCount: null,
  votesNeeded: null,
  amount: null,
  executed: null,
  url: null,
  ipfsHash: null

});
