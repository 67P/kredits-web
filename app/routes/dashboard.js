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
    schedule('afterRender', this.kredits.fetchMissingContributions,
      this.kredits.fetchMissingContributions.perform);
  }

}
