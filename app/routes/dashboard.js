import Route from '@ember/routing/route';
import { schedule } from '@ember/runloop';
import { inject as service } from '@ember/service';

export default class DashboardRoute extends Route {

  @service kredits;

  afterModel() {
    if (this.kredits.contributionsNeedSync) {
      schedule('afterRender', this.kredits.syncContributions,
        this.kredits.syncContributions.perform);
    }
    // TODO fetch automatically under a certain threshold
    // The browser might delete cached data and we don't need manual re-syncs
    // depending on how little is missing
    // schedule('afterRender', this.kredits.fetchMissingContributions,
    //   this.kredits.fetchMissingContributions.perform);
  }

}
