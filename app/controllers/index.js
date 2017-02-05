import Ember from 'ember';
import Proposal from 'kredits-web/models/proposal';

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
                          p.set('recipientName', this.findContributorByAddress(p.get('recipientAddress')).github_username);
                          return p;
                        });
    return proposals;
  }.property('model.proposals.[]', 'model.contributors.[]'),

  proposalsClosed: function() {
    let proposals = this.get('model.proposals')
                        .filterBy('executed', true)
                        .map(p => {
                          p.set('recipientName', this.findContributorByAddress(p.get('recipientAddress')).github_username);
                          return p;
                        });
    return proposals;
  }.property('model.proposals.[]', 'model.contributors.[]'),

  proposalsSorting: ['id:desc'],
  proposalsClosedSorted: Ember.computed.sort('proposalsClosed', 'proposalsSorting'),
  proposalsOpenSorted: Ember.computed.sort('proposalsOpen', 'proposalsSorting'),

  contributorsSorting: ['kredits:desc'],
  contributorsSorted: Ember.computed.sort('model.contributors', 'contributorsSorting'),

  watchContractEvents: function() {
    let events = this.get('kredits.kreditsContract')
                     .allEvents(/* [additionalFilterObject], */);

    events.watch((error, data) => {
      Ember.Logger.debug('[index] Received contract event', data);

      switch (data.event) {
        case 'ProposalCreated':
          this._handleProposalCreated(data);
          break;
      }
    });
  }.on('init'),

  _handleProposalCreated(data) {
    if (Ember.isPresent(this.get('model.proposals')
             .findBy('id', data.args.id.toNumber()))) {
      console.log('[index] proposal exists, not adding from event');
      return false;
    }

    let proposal = Proposal.create({
      id: data.args.id.toNumber(),
      creatorAddress: data.args.creator,
      recipientAddress: data.args.recipient,
      recipientName: null,
      votesCount: 0,
      votesNeeded: 2,
      amount: data.args.amount.toNumber(),
      executed: false,
      url: data.args.url,
      ipfsHash: data.args.ipfsHash
    });

    console.log('new proposal created', proposal);
    this.get('model.proposals').pushObject(proposal);
  },

  actions: {

    confirmProposal(proposalId) {
      this.get('kredits').vote(proposalId).then(transactionId => {
        window.confirm('Vote submitted to Ethereum blockhain: '+transactionId);
      });
    }

  }

});
