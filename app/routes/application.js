import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { schedule } from '@ember/runloop';

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
      })
      .then(() => {
        if (this.kredits.contributorsNeedFetch) {
          schedule('afterRender', this.kredits.syncContributors,
                   this.kredits.syncContributors.perform);
        }
        schedule('afterRender', this.kredits.syncContributions,
                 this.kredits.syncContributions.perform);
      });
  }
});
