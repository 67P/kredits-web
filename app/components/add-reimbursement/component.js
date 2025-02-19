import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { A } from '@ember/array';
import { scheduleOnce } from '@ember/runloop';
import { btcToSats, satsToBtc } from 'kredits-web/utils/btc-conversions';
import isValidAmount from 'kredits-web/utils/is-valid-amount';
import isoDateIsToday from 'kredits-web/utils/iso-date-is-today';
import readFileContent from 'kredits-web/utils/read-file-content';
import config from 'kredits-web/config/environment';

export default class AddReimbursementComponent extends Component {
  @service router;
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

  get contributorId () {
    return this.recipientId || this.kredits.currentUser?.id;
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

  // TODO use ember-concurrency here
  // https://github.com/67P/kredits-web/pull/209#discussion_r1064234421
  @action
  async addExpensesFromFile (evt) {
    const content = await readFileContent(evt.target.files[0]);
    const expenses = JSON.parse(content);

    if (expenses instanceof Array) {
      for (const item of expenses) {
        this.addExpenseItem(item);
      }
    } else {
      console.warn("Expenses in file must be a list of items:");
      console.debug(content);
    }
  }

  @action
  updateContributor (event) {
    this.recipientId = parseInt(event.target.value);
  }

  @action
  showExpenseForm () {
    this.expenseFormVisible = true;
    scheduleOnce('afterRender', this, this.scrollToExpenseItemForm);
  }

  @action
  async addExpenseItem (expense) {
    let totalBTC = parseFloat(this.total);

    if (expense.currency === "BTC") {
      expense.amountSats = btcToSats(expense.amount);
      totalBTC += expense.amount;
    } else {
      let amountSats;
      if (isoDateIsToday(expense.date)) {
        amountSats = btcToSats(expense.amount / this.exchangeRates[expense.currency]);
      } else {
        const rates = await this.exchangeRates.fetchHistoricRates(expense.date);
        amountSats = btcToSats(expense.amount / rates[expense.currency]);
      }
      expense.amountSats = amountSats;
      totalBTC += satsToBtc(amountSats);
    }
    console.debug("Adding expense:", expense);

    this.total = totalBTC.toFixed(8);
    this.expenses.pushObject(expense);
    this.expenseFormVisible = false;
  }

  @action
  async removeExpenseItem (expense) {
    let totalBTC = parseFloat(this.total);
    let amountBTC = satsToBtc(expense.amountSats);
    totalBTC = totalBTC - amountBTC;
    this.total = totalBTC.toFixed(8);

    this.expenses.removeObject(expense);

    if (this.expenses.length === 0) {
      this.expenseFormVisible = true;
    }
  }

  @action
  submit (e) {
    e.preventDefault();
    if (!this.kredits.currentUser) { window.alert('You need to connect your RSK account first.'); return false }
    if (!this.kredits.currentUserIsCore) { window.alert('Only core contributors can submit reimbursements.'); return false }

    const contributor = this.contributors.findBy('id', this.contributorId);

    const attributes = {
      amount: btcToSats(this.total),
      token: config.tokens['BTC'],
      recipientId: this.contributorId,
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
