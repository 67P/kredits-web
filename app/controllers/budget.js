import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import { action } from '@ember/object';

export default class BudgetController extends Controller {
  @service kredits;
  @service router;

  @alias('kredits.reimbursementsUnconfirmed') reimbursementsUnconfirmed;
  @alias('kredits.reimbursementsConfirmed') reimbursementsConfirmed;
  @alias('kredits.currentUserIsCore') currentUserIsCore;

  @action
  addReimbursement () {
    if (!this.kredits.currentUser) {
      window.alert('You need to connect your RSK account first.');
      return false;
    }
    if (!this.kredits.currentUserIsCore) {
      window.alert('Only core contributors can submit reimbursements.');
      return false;
    }
    this.router.transitionTo('reimbursements.new');
  }
}
