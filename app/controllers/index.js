import Ember from 'ember';
import Controller from 'ember-controller';
import computed, { alias, filter, filterBy, sort } from 'ember-computed';
import injectService from 'ember-service/inject';

export default Controller.extend({
  kredits: injectService(),

  init() {
    this._super(...arguments);
    let contract = this.get('kredits.kredits').Operator.contract;
    contract.onproposalvoted = this._handleProposalVoted.bind(this);
    contract.onproposalcreated = this._handleProposalCreated.bind(this);
    contract.onproposalexecuted = this._handleProposalExecuted.bind(this);
    // TODO: transfer on the token contract
  },

  contributors: alias('model.contributors'),
  contributorsWithKredits: filter('contributors', function(contributor) {
    return contributor.get('balance').toString() !== "0";
  }),
  contributorsSorting: ['balance:desc'],
  contributorsSorted: sort('contributorsWithKredits', 'contributorsSorting'),

  proposals: computed('model.proposals.[]', 'contributors.[]', function() {
    return this.get('model.proposals')
               .map((proposal) => {
                 let contributor = this.get('contributors')
                                       .findBy('id', proposal.get('recipientId'));

                 proposal.set('contributor', contributor);

                 return proposal;
               });
  }),
  proposalsOpen: filterBy('proposals', 'isExecuted', false),
  proposalsClosed: filterBy('proposals', 'isExecuted', true),
  proposalsSorting: ['id:desc'],
  proposalsClosedSorted: sort('proposalsClosed', 'proposalsSorting'),
  proposalsOpenSorted: sort('proposalsOpen', 'proposalsSorting'),

  _handleProposalCreated(proposalId) {
    // TODO: check if proposalId is already a string
    let proposal = this.get('proposals')
                       .findBy('id', proposalId.toString());
    if (proposal) {
      Ember.Logger.debug('[index] proposal exists, not adding from event');
      return;
    }

    proposal = this.get('kredits.kredits').Operator.getById(proposalId);
    this.get('proposals').pushObject(proposal);
  },

  _handleProposalExecuted(proposalId, recipientId, amount) {
    // TODO: check if proposalId is already a string
    let proposal = this.get('proposals')
                       .findBy('id', proposalId.toString());

    if (proposal.get('isExecuted')) {
      Ember.Logger.debug('[index] proposal already executed, not adding from event');
      return;
    }

    proposal.setProperties({
      'executed': true,
    });

    this.get('contributors')
        .findBy('id', recipientId.toString())
        .incrementProperty('balance', amount.toNumber());
  },

  _handleProposalVoted(proposalId, voter, totalVotes) {
    this.get('proposals')
        .findBy('id', proposalId.toString())
        .setProperties({ 'votesCount': totalVotes });
  },

  _handleTransfer(from, to, value) {
    value = value.toNumber();
    this.get('contributors')
        .findBy('address', from)
        .decrementProperty('balance', value);
    this.get('contributors')
        .findBy('address', to)
        .incrementProperty('balance', value);
  },


  actions: {
    confirmProposal(proposalId) {
      this.get('kredits').vote(proposalId).then(transaction => {
        window.confirm('Vote submitted to Ethereum blockhain: '+transaction.hash);
      });
    },

    save(contributor) {
      return this.get('kredits').addContributor(contributor)
        .then((contributor) => {
          this.get('contributors').pushObject(contributor);
          return contributor;
        });
    }
  }
});
