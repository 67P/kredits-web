import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { schedule } from '@ember/runloop';

export default class ApplicationRoute extends Route {

  @service kredits;

  beforeModel(/* transition */) {
    const kredits = this.kredits;

    return kredits.setup().then(() => {
      kredits.kredits.preflightChecks().catch((error) => {
        console.error('Kredits preflight check failed!');
        console.error(error);
      });
    }).catch((error) => {
      console.log('Error initializing Kredits', error);
    });
  }

  model() {
    return this.kredits.loadInitialData().then(() => {
      this.kredits.addContractEventHandlers()
    });
  }

  afterModel() {
    if (this.kredits.contributorsNeedSync) {
      schedule('afterRender', this.kredits.syncContributors,
        this.kredits.syncContributors.perform);
    }
  }

}
