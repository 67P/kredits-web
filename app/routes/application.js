import { inject as injectService } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
  kredits: injectService(),

  beforeModel(transition) {
    const kredits = this.kredits;

    return kredits.setup().then(() => {
      kredits.get('kredits').healthcheck().catch((error) => {
        console.error('Kredits healthcheck failed!');
        console.error(error);
      });
      if (kredits.get('accountNeedsUnlock')) {
        if (confirm('It looks like you have an Ethereum wallet available. Please unlock your account.')) {
          transition.retry();
        }
      }
    }).catch((error) => {
      console.log('Error initializing Kredits', error);
    });
  },

  afterModel() {
    return this.kredits.loadContributorsAndProposals()
      .then(() => {
        this.kredits.addContractEventHandlers();
      });
  }
});
