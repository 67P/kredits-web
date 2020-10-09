import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { isEmpty, isPresent } from '@ember/utils';
import { schedule } from '@ember/runloop';

export default class BudgetRoute extends Route {
  @service browserCache;
  @service kredits;

  async model () {
    if (isPresent(this.kredits.reimbursements) &&
        isEmpty(this.kredits.reimbursementsPending)) {
      // reimbursements loaded before, no need to sync or load
      return;
    }

    const numCachedReimbursements = await this.browserCache.reimbursements.length();
    if (numCachedReimbursements > 0) {
      await this.kredits.loadObjectsFromCache('Reimbursement');
      this.kredits.set('reimbursementsNeedSync', true);
    } else {
      await this.kredits.fetchObjects('Reimbursement', { page: { size: 10 } });
    }
  }

  afterModel() {
    // TODO implement syncReimbursements
    // if (this.kredits.reimbursementsNeedSync) {
    //   schedule('afterRender', this.kredits.syncReimbursements,
    //     this.kredits.syncReimbursements.perform);
    // }
  }
}
