import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
  kredits: service(),

  beforeModel(/* transition */) {
    const kredits = this.kredits;

    return kredits.setup().then(() => {
      kredits.get('kredits').preflightChecks().catch((error) => {
        console.error('Kredits preflight check failed!');
        console.error(error);
      });
    }).catch((error) => {
      console.log('Error initializing Kredits', error);
    });
  },

  afterModel() {
    return this.kredits.loadInitialData()
      .then(() => {
        this.kredits.addContractEventHandlers();
      });
  }
});
