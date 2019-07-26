import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { alias, not } from '@ember/object/computed';
import { isAddress } from 'web3-utils';
import { inject as service } from '@ember/service';
import config from 'kredits-web/config/environment';

export default Controller.extend({

  kredits: service(),

  ethAddress: null,
  githubAccessToken: alias('kredits.githubAccessToken'),

  isValidEthAccount: computed('ethAddress', function() {
    return isAddress(this.ethAddress);
  }),

  signupButtonDisabled: not('isValidEthAccount'),

  actions: {

    completeSignup () {
      const payload = {
        accessToken: this.githubAccessToken,
        account: this.ethAddress
      }

      fetch(config.githubSignupUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }).then(response => {
        return response.json();
      })
      .then(data => {
        console.log('Created contributor:', data);

        this.setProperties({
          githubAccessToken: null,
          ethAddress: null
        });

        // TODO show success message or transition to success page
      });
    }

  }

});
