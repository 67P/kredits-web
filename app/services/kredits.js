import Ember from 'ember';
import Web3 from 'npm:web3';
import config from 'kredits-web/config/environment';

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

  kreditsContract: function() {
    // TODO cache this
    let contract = this.get('web3')
                       .eth.contract(config.kreditsContract.ABI)
                       .at(config.kreditsContract.address);
    return contract;
  }.property('web3'),

  totalSupply: function() {
    return this.get('kreditsContract').totalSupply();
  }.property('kreditsContract'),

  contributorsCount: function() {
    return this.get('kreditsContract').contributorCount();
  }.property('kreditsContract'),

  contributors: function() {
    var c = [];
    for(var i = 0; i < this.get('contributorsCount').toNumber(); i++) {
      var address = this.get('kreditsContract').contributorAddresses(i);
      var person = this.get('kreditsContract').contributors(address);
      var balance = this.get('kreditsContract').balanceOf(address);
      console.log(person);
      c.push({address: address, name: person[0], github_username: person[1], github_uid: person[2], ipfsHash: person[3], kredits: balance.toNumber()});
    };
    return c;
  }.property('kreditsContract', 'contributorCount'),

  balanceOf: function(address) {
    return this.get('kreditsContract').balanceOf(address).toNumber();
  }.property('kreditsContract'),

  logKreditsContract: function() {
    Ember.Logger.debug('kreditsContract', this.get('kreditsContract'));
  }.on('init')

});
