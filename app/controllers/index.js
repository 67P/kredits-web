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

  proposalsOpen: function() {
    let proposals = this.get('model.proposals')
                        .filterBy('executed', false)
                        .map(p => {
                          p.set('recipientName', this.get('model.contributors').findBy('id', p.get('recipientId')).name);
                          return p;
                        });
    return proposals;
  }.property('model.proposals.[]', 'model.proposals.@each.executed', 'model.contributors.[]'),

  proposalsClosed: function() {
    let proposals = this.get('model.proposals')
                        .filterBy('executed', true)
                        .map(p => {
                          p.set('recipientName', this.get('model.contributors').findBy('id', p.get('recipientId')).name);
                          return p;
                        });
    return proposals;
  }.property('model.proposals.[]', 'model.proposals.@each.executed', 'model.contributors.[]'),

  proposalsSorting: ['id:desc'],
  proposalsClosedSorted: Ember.computed.sort('proposalsClosed', 'proposalsSorting'),
  proposalsOpenSorted: Ember.computed.sort('proposalsOpen', 'proposalsSorting'),

  contributorsWithKredits: function() {
    return this.get('model.contributors').filter(c => {
      return c.get('balance') !== 0;
    });
  }.property('model.contributors.@each.balance'),

  contributorsSorting: ['balance:desc'],
  contributorsSorted: Ember.computed.sort('contributorsWithKredits', 'contributorsSorting'),

  init() {
    this._super(...arguments);
    this.get('kredits.kreditsContract')
      .then((contract) => {
        contract.onproposalvoted = this._handleProposalVoted.bind(this);
        contract.onproposalcreated = this._handleProposalCreated.bind(this);
        contract.onproposalexecuted = this._handleProposalExecuted.bind(this);
        // TODO: transfer on the token contract
      });
  },

  _handleProposalCreated(proposalId, creatorAddress, recipientAddress, amount) {
    if (Ember.isPresent(this.get('model.proposals')
             .findBy('id', proposalId.toNumber()))) {
      Ember.Logger.debug('[index] proposal exists, not adding from event');
      return false;
    }

    let proposal = Proposal.create({
      id: proposalId.toNumber(),
      creatorAddress: creatorAddress,
      recipientAddress: recipientAddress,
      recipientName: null,
      votesCount: 0,
      votesNeeded: 2,
      amount: amount.toNumber(),
      executed: false
    });

    this.get('model.proposals').pushObject(proposal);
  },

  _handleProposalExecuted(proposalId, recipientId, amount) {
    if (this.get('model.proposals')
            .findBy('id', recipientId.toNumber())
            .get('executed')) {
      Ember.Logger.debug('[index] proposal already executed, not adding from event');
      return false;
    }

    this.get('model.proposals')
        .findBy('id', recipientId.toNumber())
        .setProperties({
          'executed': true,
          'votesCount': 2 // TODO use real count
        });

    this.get('model.contributors')
        .findBy('id', recipientId)
        .incrementProperty('kredits', amount.toNumber());
  },

  _handleProposalVoted(proposalId, voter, totalVotes) {
    this.get('model.proposals')
        .findBy('id', proposalId.toNumber())
        .setProperties({ 'votesCount': totalVotes });
  },

  _handleTransfer(data) {
    this.get('model.contributors')
        .findBy('address', data.args.from)
        .incrementProperty('balance', - data.args.value.toNumber());
    this.get('model.contributors')
        .findBy('address', data.args.to)
        .incrementProperty('balance', data.args.value.toNumber());
  },


  actions: {

    confirmProposal(proposalId) {
      this.get('kredits').vote(proposalId).then(transaction => {
        window.confirm('Vote submitted to Ethereum blockhain: '+transaction.hash);
      });
    }

  }

});
