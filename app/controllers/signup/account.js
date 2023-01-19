import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { alias, not } from '@ember/object/computed';
import { isAddress } from 'web3-utils';
import { inject as service } from '@ember/service';
import config from 'kredits-web/config/environment';

export default Controller.extend({

  kredits: service(),

  accountAddress: null,
  githubAccessToken: alias('kredits.githubAccessToken'),

  isValidEthAccount: computed('accountAddress', function() {
    return isAddress(this.accountAddress);
  }),

  signupButtonDisabled: not('isValidEthAccount'),

  actions: {

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
        console.log('Created contributor:', data);

        this.setProperties({
          githubAccessToken: null,
          accountAddress: null
        });

        this.transitionToRoute('signup.complete');
      });
    }

  }

});
