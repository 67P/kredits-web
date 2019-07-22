import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { not } from '@ember/object/computed';
import { isAddress } from 'web3-utils';

export default Controller.extend({

  ethAddress: null,

  isValidEthAccount: computed('ethAddress', function() {
    return isAddress(this.ethAddress);
  }),

  signupButtonDisabled: not('isValidEthAccount'),

  actions: {

    completeSignup() {
    }

  }

});
