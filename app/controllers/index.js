import Ember from 'ember';
import Controller from 'ember-controller';
import { alias, filter, filterBy, sort } from 'ember-computed';
import injectService from 'ember-service/inject';

export default Controller.extend({
  kredits: injectService(),

  contributors: alias('kredits.contributors'),
  contributorsWithKredits: filter('contributors', function(contributor) {
    return contributor.get('balance') !== 0;
  }),
  contributorsSorting: ['balance:desc'],
  contributorsSorted: sort('contributorsWithKredits', 'contributorsSorting'),

  proposals: alias('kredits.proposals'),
  proposalsOpen: filterBy('proposals', 'isExecuted', false),
  proposalsClosed: filterBy('proposals', 'isExecuted', true),
  proposalsSorting: ['id:desc'],
  proposalsClosedSorted: sort('proposalsClosed', 'proposalsSorting'),
  proposalsOpenSorted: sort('proposalsOpen', 'proposalsSorting'),

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
