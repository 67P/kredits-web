import Ember from 'ember';
import Web3 from 'npm:web3';
import config from 'kredits-web/config/environment';
import Contributor from 'kredits-web/models/contributor';
import Proposal from 'kredits-web/models/proposal';

export default Ember.Service.extend({

  web3Instance: null,
  web3Provided: false, // Web3 provided (using Mist Browser, Metamask et al.)

  web3: function() {
    if (Ember.isPresent(this.get('web3Instance'))) {
      return this.get('web3Instance');
    }

    let web3Instance;

    if (typeof window.web3 !== 'undefined') {
      Ember.Logger.debug('[kredits] Using user-provided instance, e.g. from Mist browser or Metamask');
      web3Instance = window.web3;
      this.set('web3Provided', true);
    } else {
      Ember.Logger.debug('[kredits] Creating new instance from npm module class');
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

  getValueFromContract(contractMethod, ...args) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      this.get('kreditsContract')[contractMethod](...args, (err, data) => {
        if (err) { reject(err); }
        resolve(data);
      });
    });
  },

  getContributorData(i) {
    let promise = new Ember.RSVP.Promise((resolve, reject) => {
      this.getValueFromContract('contributorAddresses', i).then(address => {
        this.getValueFromContract('contributors', address).then(person => {
          this.getValueFromContract('balanceOf', address).then(balance => {
            let contributor = Contributor.create({
              address: address,
              github_username: person[1],
              github_uid: person[0],
              ipfsHash: person[3],
              kredits: balance.toNumber()
            });
            Ember.Logger.debug('[kredits] contributor', contributor);
            resolve(contributor);
          });
        });
      }).catch(err => reject(err));
    });
    return promise;
  },

  getContributors() {
    return this.getValueFromContract('contributorsCount').then(contributorsCount => {
      let contributors = [];

      for(var i = 0; i < contributorsCount.toNumber(); i++) {
        contributors.push(this.getContributorData(i));
      }

      return Ember.RSVP.all(contributors);
    });
  },

  getProposalData(i) {
    let promise = new Ember.RSVP.Promise((resolve, reject) => {
      this.getValueFromContract('proposals', i).then(p => {
        let proposal = Proposal.create({
          id               : i,
          creatorAddress   : p[0],
          recipientAddress : p[1],
          votesCount       : p[2].toNumber(),
          votesNeeded      : p[3].toNumber(),
          amount           : p[4].toNumber(),
          executed         : p[5],
          url              : p[6],
          ipfsHash         : p[7]
        });
        Ember.Logger.debug('[kredits] proposal', proposal);
        resolve(proposal);
      }).catch(err => reject(err));
    });
    return promise;
  },

  getProposals() {
    return this.getValueFromContract('proposalsCount').then(proposalsCount => {
      let proposals = [];

      for(var i = 0; i < proposalsCount.toNumber(); i++) {
        proposals.push(this.getProposalData(i));
      }

      return Ember.RSVP.all(proposals);
    });
  },

  vote(proposalId) {
    Ember.Logger.debug('[kredits] vote for', proposalId);
    return new Ember.RSVP.Promise((resolve, reject) => {
      this.get('kreditsContract').vote(proposalId, (err, data) => {
        if (err) { reject(err); }
        Ember.Logger.debug('[kredits] vote response', data);
        resolve(data);
      });
    });
  },

  logKreditsContract: function() {
    Ember.Logger.debug('[kredits] kreditsContract', this.get('kreditsContract'));
  }.on('init')

});
