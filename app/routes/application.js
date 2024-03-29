import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { schedule } from '@ember/runloop';

export default class ApplicationRoute extends Route {
  @service kredits;
  @service communityFunds;

  beforeModel(/* transition */) {
    return this.kredits.setup().then(() => {
      this.kredits.kredits.preflightChecks().catch(error => {
        console.error('Kredits preflight check failed!');
        console.error(error);
      });
    }).catch(error => {
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

    schedule('afterRender', this.communityFunds.fetchBalances,
      this.communityFunds.fetchBalances.perform);
  }
}
