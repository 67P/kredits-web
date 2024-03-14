import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import config from 'kredits-web/config/environment';

export default class ReimbursementItemComponent extends Component {
  @service kredits;

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
  veto (id) {
    this.kredits.vetoReimbursement(id).then(transaction => {
      console.debug('[controllers:budget] Veto submitted to chain: '+transaction.hash);
    });
  }
}