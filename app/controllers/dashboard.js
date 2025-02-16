import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { alias, gt, not, sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  kredits: service(),

  showDetailsPane: false,
  selectedContributorId: null,
  selectedContributionId: null,

  currentBlock: alias('kredits.currentBlock'),

  contributions: alias('kredits.contributions'),
  contributionsConfirmed: alias('kredits.contributionsConfirmed'),
  contributionsUnconfirmed: alias('kredits.contributionsUnconfirmed'),

  contributionsSorting: Object.freeze(['date:desc', 'time:desc', 'id:desc']),
  contributionsUnconfirmedSorted: sort('contributionsUnconfirmed', 'contributionsSorting'),
  contributionsConfirmedSorted: sort('contributionsConfirmed', 'contributionsSorting'),

  kreditsByContributor: alias('kredits.kreditsByContributor'),

  kreditsToplistSorting: computed('showUnconfirmedKredits', function(){
    return this.showUnconfirmedKredits ? ['amountTotal:desc'] : ['amountConfirmed:desc'];
  }),
  kreditsToplist: computed('kreditsByContributor', function(){
    return this.kreditsByContributor.filter(c => c.amountTotal > 0);
  }),
  kreditsToplistSorted: sort('kreditsToplist', 'kreditsToplistSorting'),

  showUnconfirmedKredits: true,
  hideUnconfirmedKredits: not('showUnconfirmedKredits'),

  showQuickFilterUnconfirmed: false,
  showQuickFilterConfirmed: false,

  showFullContributionSync: gt('kredits.missingHistoricContributionsCount', 0),

  actions: {

    vetoContribution (contributionId) {
      this.kredits.veto(contributionId).then(transaction => {
        console.debug('[controllers:index] Veto submitted to chain: '+transaction.hash);
      });
    },

    toggleQuickFilterUnconfirmed () {
      this.toggleProperty('showQuickFilterUnconfirmed');
    },

    toggleQuickFilterConfirmed () {
      this.toggleProperty('showQuickFilterConfirmed');
    }

  }
});
