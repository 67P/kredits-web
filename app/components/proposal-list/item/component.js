import Component from '@ember/component';
import tag from 'ember-awesome-macros/tag';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { inject } from '@ember/service';

export default Component.extend({
  kredits: inject(),

  tagName: 'li',
  classNames: ['proposal-list-item'],

  attributeBindings: ['data-proposal-id', 'title'],

  title: tag`(${'proposal.kind'}) ${'proposal.description'}`,
  'data-proposal-id': reads('proposal.id'),

  canBeVoted: computed('voterIds.[]', 'kredits.currentUser', function() {
    let { isExecuted, voterIds } = this.proposal;
    let { currentUser } = this.kredits;
    voterIds = voterIds.map((id) => id.toString());

    return currentUser.isCore && !isExecuted && !voterIds.includes(currentUser.id);
  }),

  selected: computed('selectedProposals.[]', function() {
    return this.selectedProposals.includes(this.proposal.id);
  })
});
