import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { isPresent } from '@ember/utils';

export default Component.extend({

  tagName: '',

  kredits: service(),
  router: service(),

  setupInProgress: false,

  userHasEthereumWallet: computed(function() {
    return isPresent(window.ethereum);
  }),

  showConnectButton: computed('userHasEthereumWallet',
                              'kredits.hasAccounts', function() {
    return this.userHasEthereumWallet &&
           !this.kredits.hasAccounts;
  }),

  actions: {

    signup() {
      this.router.transitionTo('signup');
    },

    async connectAccount() {
      try {
        await window.ethereum.enable();
        this.set('setupInProgress', true);
        await this.kredits.setup();
        this.set('setupInProgress', false);
        this.router.transitionTo('dashboard');
      } catch (error) {
        this.set('setupInProgress', false);
        console.log('Opening Ethereum wallet failed:', error);
      }
    }

  }

});
