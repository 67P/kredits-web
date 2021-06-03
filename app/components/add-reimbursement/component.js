import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { A } from '@ember/array';
import { scheduleOnce } from '@ember/runloop';
import isValidAmount from 'kredits-web/utils/is-valid-amount';
import config from 'kredits-web/config/environment';

export default class AddReimbursementComponent extends Component {
  @service router;
  @service kredits;
  @service exchangeRates;

  @alias('kredits.contributorsSorted') contributors;

  @tracked contributorId = null;
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
    if (this.totalUSD === 0 && this.totalEUR === 0) {
      btcAmount = 0;
    }

    this.total = btcAmount.toFixed(8);
  }

  @action
  updateContributor(event) {
    this.contributorId = event.target.value;
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
    if (!this.kredits.currentUser) { window.alert('You need to connect your Ethereum account first.'); return false }
    if (!this.kredits.currentUserIsCore) { window.alert('Only core contributors can submit reimbursements.'); return false }

    const contributor = this.contributors.findBy('id', this.contributorId);

    const attributes = {
      amount: parseInt(parseFloat(this.total) * 100000000), // convert to sats
      token: config.tokens['WBTC'],
      contributorId: parseInt(this.contributorId),
      title: `Expenses covered by ${contributor.name}`,
      description: this.description,
      url: this.url,
      expenses: JSON.parse(JSON.stringify((this.expenses)))
    }

    this.inProgress = true;

    this.kredits.addReimbursement(attributes)
      .then((/* reimbursement */) => {
        this.router.transitionTo('budget');
      })
      .catch(e => {
        console.error('Could not add reimbursement:', e);
        window.alert('Something went wrong. Please check the browser console.')
      })
      .finally(() => {
        this.inProgress = false;
      });
  }
}
