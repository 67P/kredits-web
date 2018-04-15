import injectService from 'ember-service/inject';
import Route from 'ember-route';

export default Route.extend({
  kredits: injectService(),

  beforeModel(transition) {
    const kredits = this.get('kredits');

    return kredits.setup().then(() => {
      if (kredits.get('accountNeedsUnlock')) {
        if (confirm('It looks like you have an Ethereum wallet available. Please unlock your account.')) {
          transition.retry();
        }
      }
    });
  },

  afterModel() {
    return this.get('kredits').loadContributorsAndProposals();
  }
});
