import Controller from '@ember/controller';
import { alias, filter, sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';

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
  contributionsUnconfirmed: alias('kredits.contributionsUnconfirmed'),
  contributionsConfirmed: alias('kredits.contributionsConfirmed'),

  contributionsUnconfirmedSorted: sort('contributionsUnconfirmed', 'contributionsSorting'),
  contributionsConfirmedSorted: sort('contributionsConfirmed', 'contributionsSorting'),
  contributionsSorting: Object.freeze(['id:desc']),

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
