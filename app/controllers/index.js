import Controller from '@ember/controller';
import { alias, filter, sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Controller.extend({
  kredits: service(),
  currentBlock: alias('kredits.currentBlock'),

  contributors: alias('kredits.contributors'),
  contributorsWithKredits: filter('contributors', function(contributor) {
    return contributor.get('totalKreditsEarnedRaw').gt(0);
  }),
  contributorsSorting: Object.freeze(['totalKreditsEarned:desc']),
  contributorsSorted: sort('contributorsWithKredits', 'contributorsSorting'),

  contributions: alias('kredits.contributions'),
  contributionsSorting: Object.freeze(['id:desc']),

  contributionsUnconfirmed: computed('contributions.[]', 'currentBlock', function() {
    return this.contributions.filter(contribution => {
      return contribution.confirmedAt > this.currentBlock;
    });
  }),
  contributionsConfirmed: computed('contributions.[]', 'currentBlock', function() {
    return this.contributions.filter(contribution => {
      return contribution.confirmedAt <= this.currentBlock;
    });
  }),

  contributionsUnconfirmedSorted: sort('contributionsUnconfirmed', 'contributionsSorting'),
  contributionsConfirmedSorted: sort('contributionsConfirmed', 'contributionsSorting'),

  actions: {

    vetoContribution (/* contributionId */) {
      // this.kredits.vote(proposalId).then(transaction => {
      //   window.confirm('Vote submitted to Ethereum blockhain: '+transaction.hash);
      // });
    },

    confirmProposal (proposalId) {
      this.kredits.vote(proposalId).then(transaction => {
        window.confirm('Vote submitted to Ethereum blockhain: '+transaction.hash);
      });
    },

    save (contributor) {
      return this.kredits.addContributor(contributor)
        .then((contributor) => {
          this.contributors.pushObject(contributor);
          return contributor;
        });
    }

  }
});
