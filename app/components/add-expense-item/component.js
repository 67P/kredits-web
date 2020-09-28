import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import moment from 'moment';

export default class AddExpenseItemComponent extends Component {

  // @tracked newExpense = Expense.create();
  @tracked amount = '0';
  @tracked currency = 'EUR';
  @tracked date = moment().startOf('hour').toDate();
  @tracked title = '';
  @tracked description = '';
  @tracked url = '';
  @tracked tags = '';

  defaultDate = moment().startOf('hour').toDate();

  // TODO fetch/apply exchange rate to (W)BTC
  currencies = [
    { code: 'EUR' },
    { code: 'USD' },
    { code: 'GBP' }
  ];

  get submitButtonEnabled () {
    return true;
  }

  get submitButtonDisabled () {
    return !this.submitButtonEnabled;
  }

  setDefaultValues () {
  }

  @action
  submit (e) {
    e.preventDefault();

    let dateInput = (this.date instanceof Array) ?
      this.date[0] : this.date;
    const [ date ] = dateInput.toISOString().split('T');

    // TODO validate form
    const expense = {
      amount: parseFloat(this.amount),
      currency: this.currency,
      date: date,
      title: this.title,
      description: this.description,
      url: this.url,
      tags: this.tags.split(',').map(t => t.trim())
    }

    this.args.addExpenseItem(expense);
    this.resetProperties();
  }
}
