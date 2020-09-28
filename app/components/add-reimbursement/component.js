import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { A } from '@ember/array';
import Reimbursement from 'kredits-web/models/reimbursement';
import Expense from 'kredits-web/models/expense';

export default class AddReimbursementComponent extends Component {
  @service kredits;

  @tracked recipientId = null;
  @tracked title = '';
  @tracked total = '0';
  @tracked expenses = A([]);;
  @tracked newExpense = Expense.create();

  // TODO fetch/apply exchange rate to (W)BTC
  currencies = [
    { code: 'EUR' },
    { code: 'USD' },
    { code: 'GBP' }
  ];

  get typeofTotal() {
    return typeof this.total;
  }

  get submitButtonEnabled() {
    return this.expenses.length > 0;
  }

  get submitButtonDisabled() {
    return !this.submitButtonEnabled;
  }

  @alias('kredits.contributorsSorted') contributors;

  @action
  submit(e) {
    e.preventDefault();
    console.log('submit', e);
    // TODO
    // amount = parseFloat(this.total)
    // token = "WBTC" (or token address)
    // title = "Expenses covered by contributor.name"
  }
}
