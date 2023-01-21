import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { alias } from '@ember/object/computed';
import { tracked } from '@glimmer/tracking';
import config from 'kredits-web/config/environment';
import { isAddress } from 'web3-utils';

export default class BudgetController extends Controller {
  @service kredits;

  @tracked accountAddress = null;

  @alias('kredits.githubAccessToken') githubAccessToken;

  get isValidEthAccount () {
    return isAddress(this.accountAddress);
  }

  get signupButtonDisabled () {
    return !this.isValidEthAccount;
  }

  @action
  completeSignup () {
    const payload = {
      accessToken: this.githubAccessToken,
      account: this.accountAddress
    }

    fetch(config.githubSignupUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert('Creating profile failed. We have been notified about this error and will take a look soon. Sorry!');
        console.warn('Creating contributor profile failed:',
          JSON.parse(data.error.body).error.message)
        return false;
      } else {
        console.log('[signup/account] Created contributor:', data);

        this.githubAccessToken = null;
        this.accountAddress = null;

        this.transitionToRoute('signup.complete');
      }
    })
  }
}
