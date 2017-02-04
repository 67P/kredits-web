import Ember from 'ember';
import Web3 from 'npm:web3';
import config from 'kredits-web/config/environment';
import Contributor from 'kredits-web/models/contributor';

export default Ember.Service.extend({

  web3Instance: null,
  web3Provided: false, // Web3 provided (using Mist Browser, Metamask et al.)

  web3: function() {
    if (Ember.isPresent(this.get('web3Instance'))) {
      return this.get('web3Instance');
    }

    let web3Instance;

    if (typeof window.web3 !== 'undefined') {
      Ember.Logger.debug('[web3] Using user-provided instance, e.g. from Mist browser or Metamask');
      web3Instance = window.web3;
      this.set('web3Provided', true);
    } else {
      Ember.Logger.debug('[web3] Creating new instance from npm module class');
      let provider = new Web3.providers.HttpProvider("http://139.59.248.169:8545");
      web3Instance = new Web3(provider);
    }

    this.set('web3Instance', web3Instance);
    window.web3 = web3Instance;

    return web3Instance;
  }.property('web3Instance'),

  kreditsContract: function() {
    // TODO cache this
    let contract = this.get('web3')
                       .eth.contract(config.kreditsContract.ABI)
                       .at(config.kreditsContract.address);
    window.Kredits = contract;
    return contract;
  }.property('web3'),

  totalSupply: function() {
    return 23000;
    // return this.get('kreditsContract').totalSupply();
  }.property('kreditsContract'),

  getValueFromContract(contractMethod, ...args) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      this.get('kreditsContract')[contractMethod](...args, (err, data) => {
        if (err) { reject(err); }
        resolve(data);
      });
    });
  },

  getContributors() {
    return this.getValueFromContract('contributorsCount').then(contributorsCount => {
      let contributors = [];

      for(var i = 0; i < contributorsCount.toNumber(); i++) {
        contributors.push(new Ember.RSVP.Promise((resolve/*, reject*/) => {
          let c = {};
          this.getValueFromContract('contributorAddresses', i).then(address => {
            c.address = address;
            this.getValueFromContract('contributors', address).then(person => {
              c.person = person;
              this.getValueFromContract('balanceOf', c.address).then(balance => {
                c.balance = balance;
                let contributor = Contributor.create({
                  address: c.address,
                  github_username: c.person[1],
                  github_uid: c.person[0],
                  ipfsHash: c.person[3],
                  kredits: c.balance.toNumber()
                });
                console.log(contributor);
                resolve(contributor);
              });
            });
          });
        }));
      }

      return Ember.RSVP.all(contributors);
    });
  },

  balanceOf: function(address) {
    return this.get('kreditsContract').balanceOf(address).toNumber();
  }.property('kreditsContract'),

  logKreditsContract: function() {
    Ember.Logger.debug('kreditsContract', this.get('kreditsContract'));
  }.on('init')

});
