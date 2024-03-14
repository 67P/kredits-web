import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import config from 'kredits-web/config/environment';

export default class ReimbursementItemComponent extends Component {
  @service kredits;
  @tracked showExpenseDetails = false;

  constructor(owner, args) {
    super(owner, args);
    if (this.isUnconfirmed && !this.args.reimbursement.vetoed) {
      this.showExpenseDetails = true;
    }
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

  get showVetoButton () {
    return this.isUnconfirmed && this.kredits.currentUserIsCore;
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
