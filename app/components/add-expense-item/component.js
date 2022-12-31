import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import moment from 'moment';
import isValidAmount from 'kredits-web/utils/is-valid-amount';
import { isPresent } from '@ember/utils';

export default class AddExpenseItemComponent extends Component {
  @tracked amount = '0';
  @tracked currency = 'EUR';
  @tracked date = moment().startOf('hour').toDate();
  @tracked title = '';
  @tracked description = '';
  @tracked url = '';
  @tracked tags = '';

  defaultDate = moment().startOf('hour').toDate();

  currencies = [
    { code: 'EUR' },
    { code: 'USD' }
  ];

  get isValidAmount () {
    return isValidAmount(this.amount);
  }

  get amountInputClass () {
    return this.isValidTotal ? 'valid' : '';
  }

  validateForm () {
    const formEl = document.querySelector('form#add-expense-item');
    const inputFields = formEl.querySelectorAll('input');
    inputFields.forEach(i => i.classList.remove('invalid'));
    let validity = true;

    if (!this.isValidAmount) {
      document.querySelector('input[name=expense-amount]').classList.add('invalid');
      validity = false;
    }

    if (!formEl.checkValidity()) {
      inputFields.forEach(i => {
        if (!i.validity.valid) {
          i.classList.add('invalid');
          validity = false;
        }
      })
    }

    return validity;
  }

  @action
  updateCurrency(event) {
    this.currency = event.target.value;
  }

  @action
  submit (e) {
    e.preventDefault();

    let dateInput = (this.date instanceof Array) ?
      this.date[0] : this.date;

    const [ date ] = moment(dateInput).utcOffset(0, true)
                                      .toISOString()
                                      .split('T');

    const isValid = this.validateForm();
    if (!isValid) return false;

    const expense = {
      amount: parseFloat(this.amount),
      currency: this.currency,
      date: date,
      title: this.title,
      description: isPresent(this.description) ? this.description : undefined,
      url: isPresent(this.url) ? this.url : undefined,
    }

    if (isPresent(this.tags)) {
      expense.tags = this.tags.split(',')
                              .map(t => t.trim())
                              .filter(t => t.length > 0);
    }

    this.args.addExpenseItem(expense);
  }
}
