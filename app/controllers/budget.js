import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';

export default class BudgetController extends Controller {
  @service kredits;

  @alias('kredits.reimbursementsUnconfirmed') reimbursementsUnconfirmed;
  @alias('kredits.reimbursementsConfirmed') reimbursementsConfirmed;
}
