import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';

export default class SignupAccountRoute extends Route {
  @service kredits;

  async setupController (controller) {
    if (!window.ethereum) return;

    if (this.kredits.hasAccounts) {
      controller.accountAddress = this.kredits.currentUserAccounts.firstObject;
    } else {
      return this.kredits.connectWallet();
    }
  }

  redirect () {
    if (isEmpty(this.kredits.githubAccessToken)) {
      this.transitionTo('signup.index');
    }
  }
}
