import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { A } from '@ember/array';
import { scheduleOnce } from '@ember/runloop';
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

  scrollToExpenseItemForm () {
    const anchor = document.getElementById('new-expense-item');
    anchor.scrollIntoView();
  }

  @action
  showExpenseForm () {
    this.expenseFormVisible = true;
    scheduleOnce('afterRender', this, this.scrollToExpenseItemForm);
  }

  @action
  addExpenseItem (expenseItem) {
    this.expenses.pushObject(expenseItem);
    this.expenseFormVisible = false;
  }

  @action
  removeExpenseItem (expenseItem) {
    this.expenses.removeObject(expenseItem);

    if (this.expenses.length === 0) {
      this.expenseFormVisible = true;
    }
  }

  @action
  submit (e) {
    e.preventDefault();
    // TODO
    // amount = parseFloat(this.total)
    // token = "WBTC" (or token address)
    // title = "Expenses covered by contributor.name"
  }
}
