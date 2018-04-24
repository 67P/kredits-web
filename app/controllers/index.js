import Controller from '@ember/controller';
import { alias, filter, filterBy, sort } from '@ember/object/computed';
import { inject as injectService } from '@ember/service';

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
    confirmProposals(proposalIds) {
      if (this.kredits.currentUser.isCore) {
        this.kredits.batchVote(proposalIds)
          .then((transaction) => {
            window.confirm('Vote submitted to Ethereum blockhain: '+transaction.hash);
          });
      } else {
        window.alert('Only members can vote on proposals. Please ask someone to set you up.');
      }
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
