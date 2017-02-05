import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'ul',
  classNames: ['proposal-list'],

  actions: {

    confirm(proposalId) {
      this.sendAction('confirmAction', proposalId);
    }

  }

});
