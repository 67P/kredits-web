import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import config from 'kredits-web/config/environment';
import fmtDateLocalized from 'kredits-web/helpers/fmt-date-localized';

export default class ReimbursementItemComponent extends Component {
  @service kredits;
  @tracked showExpenseDetails = false;

  constructor(owner, args) {
    super(owner, args);
    if (this.isUnconfirmed && !this.isVetoed) {
      this.showExpenseDetails = true;
    }
    console.debug(fmtDateLocalized);
  }

  get ipfsGatewayUrl () {
    return config.ipfs.gatewayUrl;
  }

  get isConfirmed () {
    return (this.args.reimbursement.confirmedAt - this.kredits.currentBlock) <= 0;
  }

  get isUnconfirmed () {
    return !this.isConfirmed;
  }

  get isVetoed () {
    return this.args.reimbursement.vetoed;
  }

  get showVetoButton () {
    return this.isUnconfirmed && this.kredits.currentUserIsCore;
  }

  get showConfirmedIn () {
    return !this.isVetoed &&
           (this.showExpenseDetails || this.isUnconfirmed);
  }

  get expenses () {
    return this.args.reimbursement.expenses;
  }

  get expensesDateRange () {
    const dates = this.expenses.map(e => e.date).uniq().sort();
    let out = fmtDateLocalized.compute(dates.firstObject)
    if (dates.length > 1) {
      out += ' - ' + fmtDateLocalized.compute(dates.lastObject)
    }
    return out;
  }

  @action
  toggleExpenseDetails () {
    this.showExpenseDetails = !this.showExpenseDetails;
  }

  @action
  veto (id) {
    this.kredits.vetoReimbursement(id).then(transaction => {
      console.debug('[controllers:budget] Veto submitted to chain: '+transaction.hash);
    });
  }
}
