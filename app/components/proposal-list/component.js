import Component from '@ember/component';
import { inject } from '@ember/service';
import { empty } from '@ember/object/computed';

export default Component.extend({
  kredits: inject(),

  tagName: 'ul',
  classNames: ['proposal-list'],

  selectedProposals: [],
  submitButtonDisabled: empty('selectedProposals'),

  actions: {
    toggleSelect(proposalId, selected) {
      if (selected) {
        this.selectedProposals.removeObject(proposalId);
      } else {
        this.selectedProposals.addObject(proposalId);
      }
    },
  }
});
