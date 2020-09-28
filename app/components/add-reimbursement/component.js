import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { A } from '@ember/array';
import Reimbursement from 'kredits-web/models/reimbursement';

export default class AddReimbursementComponent extends Component {
  @service kredits;

  @alias('kredits.contributorsSorted') contributors;

  @tracked recipientId = null;
  @tracked title = '';
  @tracked total = '0';
  @tracked expenses = A([]);
  @tracked expenseFormVisible = true;

  get submitButtonEnabled () {
    return this.expenses.length > 0;
  }

  get submitButtonDisabled () {
    return !this.submitButtonEnabled;
  }

  @action
  showExpenseForm () {
    this.expenseFormVisible = true;
  }

  @action
  addExpenseItem (expenseItem) {
    this.expenses.pushObject(expenseItem);
    this.expenseFormVisible = false;
  }

  @action
  submit (e) {
    e.preventDefault();
    console.log('submit', e);
    // TODO
    // amount = parseFloat(this.total)
    // token = "WBTC" (or token address)
    // title = "Expenses covered by contributor.name"
  }
}
