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

  findContributorByAddress(address) {
    return this.get('model.contributors')
               .findBy('address', address);
  },

  actions: {

    confirmProposal(proposalId) {
      this.get('kredits').vote(proposalId).then(transactionId => {
        window.confirm('Vote submitted to Ethereum blockhain: '+transactionId);
      });
    }

  }

});
