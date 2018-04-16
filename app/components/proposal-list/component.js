import Component from '@ember/component';

export default Component.extend({

  tagName: 'ul',
  classNames: ['proposal-list'],

  actions: {

    confirm(proposalId) {
      if (this.contractInteractionEnabled) {
        this.confirmProposal(proposalId);
      } else {
        window.alert('Only members can vote on proposals. Please ask someone to set you up.');
      }
    }

  }

});
