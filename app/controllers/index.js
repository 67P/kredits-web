import Ember from 'ember';

const {
  computed,
  inject: {
    service
  }
} = Ember;

export default Ember.Controller.extend({

  kredits: service(),

  contractInteractionEnabled: computed.alias('kredits.web3Provided'),

  findContributorByAddress(address) {
    return this.get('model.contributors')
               .findBy('address', address);
  },

  proposalsOpen: function() {
    let proposals = this.get('model.proposals')
                        .filterBy('executed', false)
                        .map(p => {
                          p.recipientName = this.findContributorByAddress(p.recipientAddress).github_username;
                          return p;
                        });
    return proposals;
  }.property('model.proposals.[]', 'model.contributors.[]'),

  proposalsClosed: function() {
    let proposals = this.get('model.proposals')
                        .filterBy('executed', true)
                        .map(p => {
                          p.recipientName = this.findContributorByAddress(p.recipientAddress).github_username;
                          return p;
                        });
    return proposals;
  }.property('model.proposals.[]', 'model.contributors.[]'),

  proposalsSorting: ['id:desc'],
  proposalsClosedSorted: Ember.computed.sort('proposalsClosed', 'proposalsSorting'),
  proposalsOpenSorted: Ember.computed.sort('proposalsOpen', 'proposalsSorting'),

  contributorsSorting: ['kredits:desc'],
  contributorsSorted: Ember.computed.sort('model.contributors', 'contributorsSorting'),

  actions: {

    confirmProposal(proposalId) {
      this.get('kredits').vote(proposalId).then(transactionId => {
        window.confirm('Vote submitted to Ethereum blockhain: '+transactionId);
      });
    }

  }

});
