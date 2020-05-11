import Component from '@ember/component';
import { computed } from '@ember/object';
import { sort } from '@ember/object/computed';
import { isPresent } from '@ember/utils';
import { inject as service } from '@ember/service';

export default Component.extend({

  router: service(),

  tagName: 'div',
  classNames: ['contributions'],

  selectedContribution: null,

  showQuickFilter: false,
  hideSmallContributions: false,
  contributorId: null,
  contributionKind: null,

  kredits: service(),

  contributorsSorting: Object.freeze(['name:asc']),
  contributors: sort('kredits.contributors', 'contributorsSorting'),

  contributorsActive: computed('contributors.[]', 'contributions', function() {
    const activeIds = new Set(this.contributions.mapBy('contributorId')
                                                .map(id => id.toString()));

    return this.contributors.filter(c => activeIds.has(c.id.toString()));
  }),

  contributionKinds: computed('contributions.[]', function() {
    return this.contributions.mapBy('kind').uniq();
  }),

  contributionsFiltered: computed('contributions.[]', 'hideSmallContributions', 'contributorId', 'contributionKind', function() {
    return this.contributions.filter(c => {
      let included = true;

      if (this.hideSmallContributions &&
          c.amount <= 500) { included = false; }

      if (isPresent(this.contributorId) &&
          c.contributorId.toString() !== this.contributorId.toString()) { included = false; }

      if (isPresent(this.contributionKind) &&
          c.kind !== this.contributionKind) { included = false; }

      return included;
    });
  }),

  actions: {

    veto (contributionId) {
      if (this.contractInteractionEnabled) {
        this.vetoContribution(contributionId);
      } else {
        window.alert('Only members can veto contributions. Please ask someone to set you up.');
      }
    },

    openContributionDetails(contribution) {
      this.router.transitionTo('dashboard.contributions.show', contribution);
    }

  }

});
