import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { A } from '@ember/array';
import { scheduleOnce } from '@ember/runloop';
import Reimbursement from 'kredits-web/models/reimbursement';
import isValidAmount from 'kredits-web/utils/is-valid-amount';

export default class AddReimbursementComponent extends Component {
  @service kredits;
  @service exchangeRates;

  @alias('kredits.contributorsSorted') contributors;

  @tracked recipientId = null;
  @tracked title = '';
  @tracked total = '0';
  @tracked expenses = A([]);
  @tracked expenseFormVisible = true;

  constructor() {
    super(...arguments);
    this.exchangeRates.fetchRates();
  }

  get isValidTotal () {
    return isValidAmount(this.total);
  }

  get totalInputClass () {
    return this.isValidTotal ? 'valid' : '';
  }

  get totalEUR () {
    const expenses = this.expenses.filterBy('currency', 'EUR');
    if (expenses.length > 0) {
      return expenses.mapBy('amount')
                     .reduce((summation, current) => summation + current);
    } else {
      return 0;
    }
  }

  get totalUSD () {
    const expenses = this.expenses.filterBy('currency', 'USD');
    if (expenses.length > 0) {
      return expenses.mapBy('amount')
                     .reduce((summation, current) => summation + current);
    } else {
      return 0;
    }
  }

  get submitButtonEnabled () {
    return this.isValidTotal &&
           (this.expenses.length > 0);
  }

  get submitButtonDisabled () {
    return !this.submitButtonEnabled;
  }

  scrollToExpenseItemForm () {
    const anchor = document.getElementById('new-expense-item');
    anchor.scrollIntoView();
  }

  updateTotalAmountFromFiat() {
    let btcAmount = parseFloat(this.total);

    if (this.exchangeRates.btceur > 0 && this.totalEUR > 0) {
      btcAmount += (this.totalEUR / this.exchangeRates.btceur);
    }
    if (this.exchangeRates.btcusd > 0 && this.totalUSD > 0) {
      btcAmount += (this.totalUSD / this.exchangeRates.btcusd);
    }

    this.total = btcAmount.toFixed(8);
  }

  @action
  showExpenseForm () {
    this.expenseFormVisible = true;
    scheduleOnce('afterRender', this, this.scrollToExpenseItemForm);
  }

  @action
  addExpenseItem (expenseItem) {
    this.expenses.pushObject(expenseItem);
    this.updateTotalAmountFromFiat();
    this.expenseFormVisible = false;
  }

  @action
  removeExpenseItem (expenseItem) {
    this.expenses.removeObject(expenseItem);
    this.updateTotalAmountFromFiat();

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
