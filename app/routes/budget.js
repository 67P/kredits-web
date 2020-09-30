import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class BudgetRoute extends Route {

  @service browserCache;
  @service kredits;

  async model () {
    if (this.kredits.reimbursements.length > 0) return;

    const numCachedReimbursements = await this.browserCache.reimbursements.length();
    if (numCachedReimbursements > 0) {
      await this.kredits.loadObjectsFromCache('Reimbursement');
      this.kredits.set('reimbursementsNeedSync', true);
    } else {
      await this.kredits.fetchObjects('Reimbursement', { page: { size: 10 } });
    }
  }

  // afterModel() {
  //   if (this.kredits.reimbursementsNeedSync) {
  //     schedule('afterRender', this.kredits.syncReimbursements,
  //       this.kredits.syncReimbursements.perform);
  //   }
  // }

}
