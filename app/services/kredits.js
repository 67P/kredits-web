import Ember from 'ember';
import Web3 from 'npm:web3';

export default Ember.Service.extend({

  web3Instance: null,

  web3: function() {
    if (Ember.isPresent(this.get('web3Instance'))) {
      return this.get('web3Instance');
    }

    let web3Instance;

    if (typeof window.web3 !== 'undefined') {
      Ember.Logger.debug('[web3] Using user-provided instance, e.g. from Mist browser or Metamask');
      web3Instance = window.web3;
    } else {
      Ember.Logger.debug('[web3] Creating new instance from npm module class');
      let provider = new Web3.providers.HttpProvider("http://localhost:8545");
      web3Instance = new Web3(provider);
    }

    this.set('web3Instance', web3Instance);

    return web3Instance;
  }.property('web3Instance'),

  contract: function() {
    // let web3 = this.get('web3');
    let contract = null;

    return contract;
  }.property('web3'),

  totalSupply: function() {
    return 23000;
  }.property()

});
