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
                          p.set('recipientName', this.findContributorByAddress(p.get('recipientAddress')).name);
                          return p;
                        });
    return proposals;
  }.property('model.proposals.[]', 'model.proposals.@each.executed', 'model.contributors.[]'),

  proposalsClosed: function() {
    let proposals = this.get('model.proposals')
                        .filterBy('executed', true)
                        .map(p => {
                          p.set('recipientName', this.findContributorByAddress(p.get('recipientAddress')).name);
                          return p;
                        });
    return proposals;
  }.property('model.proposals.[]', 'model.proposals.@each.executed', 'model.contributors.[]'),

  proposalsSorting: ['id:desc'],
  proposalsClosedSorted: Ember.computed.sort('proposalsClosed', 'proposalsSorting'),
  proposalsOpenSorted: Ember.computed.sort('proposalsOpen', 'proposalsSorting'),

  contributorsWithKredits: function() {
    return this.get('model.contributors').filter(c => {
      return c.get('kredits') !== 0;
    });
  }.property('model.contributors.@each.kredits'),

  contributorsSorting: ['kredits:desc'],
  contributorsSorted: Ember.computed.sort('contributorsWithKredits', 'contributorsSorting'),

  watchContractEvents: function() {
    let events = this.get('kredits.kreditsContract')
                     .allEvents(/* [additionalFilterObject], */);

    events.watch((error, data) => {
      Ember.Logger.debug('[index] Received contract event', data);

      switch (data.event) {
        case 'ProposalCreated':
          this._handleProposalCreated(data);
          break;
        case 'ProposalExecuted':
          this._handleProposalExecuted(data);
          break;
        case 'ProposalVoted':
          this._handleProposalVoted(data);
          break;
        case 'Transfer':
          this._handleTransfer(data);
          break;
      }
    });
  }.on('init'),

  _handleProposalCreated(data) {
    if (Ember.isPresent(this.get('model.proposals')
             .findBy('id', data.args.id.toNumber()))) {
      Ember.Logger.debug('[index] proposal exists, not adding from event');
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

    this.get('model.proposals').pushObject(proposal);
  },

  _handleProposalExecuted(data) {
    if (this.get('model.proposals')
            .findBy('id', data.args.id.toNumber())
            .get('executed')) {
      Ember.Logger.debug('[index] proposal already executed, not adding from event');
      return false;
    }

    this.get('model.proposals')
        .findBy('id', data.args.id.toNumber())
        .setProperties({
          'executed': true,
          'votesCount': 2 // TODO use real count
        });

    this.get('model.contributors')
        .findBy('address', data.args.recipient)
        .incrementProperty('kredits', data.args.amount.toNumber());
  },

  _handleProposalVoted(data) {
    this.get('model.proposals')
        .findBy('id', data.args.id.toNumber())
        .incrementProperty('votesCount', 1);
  },

  _handleTransfer(data) {
    this.get('model.contributors')
        .findBy('address', data.args.from)
        .incrementProperty('kredits', - data.args.value.toNumber());
    this.get('model.contributors')
        .findBy('address', data.args.to)
        .incrementProperty('kredits', data.args.value.toNumber());
  },


  actions: {

    confirmProposal(proposalId) {
      this.get('kredits').vote(proposalId).then(transactionId => {
        window.confirm('Vote submitted to Ethereum blockhain: '+transactionId);
      });
    }

  }

});
