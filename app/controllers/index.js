import Controller from '@ember/controller';
import { alias, filter, filterBy, sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  kredits: service(),

  contributors: alias('kredits.contributors'),
  contributorsWithKredits: filter('contributors', function(contributor) {
    return contributor.get('balance') !== 0;
  }),
  contributorsSorting: Object.freeze(['balance:desc']),
  contributorsSorted: sort('contributorsWithKredits', 'contributorsSorting'),

  proposals: alias('kredits.proposals'),
  proposalsOpen: filterBy('proposals', 'isExecuted', false),
  proposalsClosed: filterBy('proposals', 'isExecuted', true),
  proposalsSorting: Object.freeze(['id:desc']),
  proposalsClosedSorted: sort('proposalsClosed', 'proposalsSorting'),
  proposalsOpenSorted: sort('proposalsOpen', 'proposalsSorting'),

  actions: {
    confirmProposal(proposalId) {
      this.kredits.vote(proposalId).then(transaction => {
        window.confirm('Vote submitted to Ethereum blockhain: '+transaction.hash);
      });
    },

    save(contributor) {
      return this.kredits.addContributor(contributor)
        .then((contributor) => {
          this.contributors.pushObject(contributor);
          return contributor;
        });
    }
  }
});
