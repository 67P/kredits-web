import Component from '@ember/component';

export default Component.extend({

  tagName: 'ul',
  classNames: ['contribution-list'],

  // actions: {
  //
  //   veto (contributionId) {
  //     if (this.contractInteractionEnabled) {
  //       this.vetoContribution(contributionId);
  //     } else {
  //       window.alert('Only members can veto contributions. Please ask someone to set you up.');
  //     }
  //   }
  //
  // }

});
