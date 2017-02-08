import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'ul',
  classNames: ['proposal-list'],

  actions: {

    confirm(proposalId) {
      if (this.get('contractInteractionEnabled')) {
        this.sendAction('confirmAction', proposalId);
      } else {
        window.alert('Only members can vote on proposals. Please ask someone to set you up.');
      }
    }

  }

});
