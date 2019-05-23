import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { alias, not, sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  kredits: service(),
  currentBlock: alias('kredits.currentBlock'),

  contributions: alias('kredits.contributions'),
  contributionsConfirmed: alias('kredits.contributionsConfirmed'),
  contributionsUnconfirmed: alias('kredits.contributionsUnconfirmed'),

  contributionsSorting: Object.freeze(['id:desc']),
  contributionsUnconfirmedSorted: sort('contributionsUnconfirmed', 'contributionsSorting'),
  contributionsConfirmedSorted: sort('contributionsConfirmed', 'contributionsSorting'),

  kreditsByContributor: alias('kredits.kreditsByContributor'),

  kreditsToplistSorting: computed('showUnconfirmedKredits', function(){
    return this.showUnconfirmedKredits ? ['amountTotal:desc'] : ['amountConfirmed:desc'];
  }),
  kreditsToplist: sort('kreditsByContributor', 'kreditsToplistSorting'),

  showUnconfirmedKredits: true,
  hideUnconfirmedKredits: not('showUnconfirmedKredits'),

  actions: {

    vetoContribution (contributionId) {
      this.kredits.veto(contributionId).then(transaction => {
        console.debug('[controllers:index] Veto submitted to Ethereum blockhain: '+transaction.hash);
      });
    },

    confirmProposal (proposalId) {
      this.kredits.vote(proposalId).then(transaction => {
        console.debug('[controllers:index] Vote submitted to Ethereum blockhain: '+transaction.hash);
      });
    }

  }
});
