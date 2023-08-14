import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { isPresent } from '@ember/utils';

export default class TopbarAccountPanelComponent extends Component {
  @service router;
  @service kredits;

  @tracked setupInProgress = false;

  get userHasWallet () {
    return isPresent(window.ethereum);
  }

  get walletConnected () {
    return this.userHasWallet && this.kredits.hasAccounts;
  }

  get walletDisconnected () {
    return this.userHasWallet && !this.kredits.hasAccounts;
  }

  @action
  signup () {
    this.router.transitionTo('signup');
  }

  @action
  async connectWallet () {
    this.setupInProgress = true;
    await this.kredits.connectWallet();
    this.setupInProgress = false;
  }

}
