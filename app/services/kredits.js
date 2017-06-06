import Ember from 'ember';
import Web3 from 'npm:web3';
import config from 'kredits-web/config/environment';
import Contributor from 'kredits-web/models/contributor';
import Proposal from 'kredits-web/models/proposal';
import kreditsContracts from 'npm:kredits-contracts';
import uuid from 'npm:uuid';

const {
  Service,
  isPresent,
  inject: {
    service
  }
} = Ember;

export default Service.extend({

  ipfs: service(),

  web3Instance: null,
  web3Provided: false, // Web3 provided (using Mist Browser, Metamask et al.)

  web3: function() {
    if (this.get('web3Instance')) {
      return this.get('web3Instance');
    }

    let web3Instance;

    if (typeof window.web3 !== 'undefined') {
      Ember.Logger.debug('[kredits] Using user-provided instance, e.g. from Mist browser or Metamask');
      web3Instance = window.web3;
      this.set('web3Provided', true);
    } else {
      Ember.Logger.debug('[kredits] Creating new instance from npm module class');
      let providerUrl = localStorage.getItem('config:web3ProviderUrl') || config.web3ProviderUrl;
      let provider = new Web3.providers.HttpProvider(providerUrl);
      web3Instance = new Web3(provider);
    }

    this.set('web3Instance', web3Instance);
    window.web3 = web3Instance;

    return web3Instance;
  }.property('web3Instance'),

  currentUserAccounts: function() {
    return (this.get('web3Provided') && this.get('web3').eth.accounts) || [];
  }.property('web3Provided', 'web3'),

  initializeKreditsContract() {
    let contract = null;

    if (isPresent(config.contractMetadata)) {
      if (localStorage.getItem('config:networkId')) {
        config.contractMetadata['networkId'] = localStorage.getItem('config:networkId');
      }
      contract = kreditsContracts(this.get('web3'), config.contractMetadata)['Kredits'];
    } else {
      contract = kreditsContracts(this.get('web3'))['Kredits'];
    }

    return contract;
  },

  kreditsContract: function() {
    if (this.get('kreditsContractInstance')) {
      return this.get('kreditsContractInstance');
    }

    let contract = this.initializeKreditsContract();

    this.set('kreditsContractInstance', contract);
    // window.Kredits = contract;
    return contract;
  }.property('kreditsContractInstance', 'web3'),

  tokenContract: function() {
    if (this.get('tokenContractInstance')) {
      return this.get('tokenContractInstance');
    }

    let contract = kreditsContracts(this.get('web3'), config.contractMetadata)['Token'];
    this.set('tokenContractInstance', contract);
    window.Token = contract;
    return contract;
  }.property('tokenContractInstance', 'web3'),

  getValueFromContract(contract, contractMethod, ...args) {
    Ember.Logger.debug('[kredits] read from contract', contract);
    return new Ember.RSVP.Promise((resolve, reject) => {
      this.get(contract)[contractMethod](...args, (err, data) => {
        if (err) { reject(err); return; }
        resolve(data);
      });
    });
  },

  getContributorData(i) {
    let promise = new Ember.RSVP.Promise((resolve, reject) => {
      this.getValueFromContract('kreditsContract', 'contributorAddresses', i).then(address => {
        this.getValueFromContract('kreditsContract', 'contributors', address).then(person => {
          this.getValueFromContract('tokenContract', 'balanceOf', address).then(balance => {
            Ember.Logger.debug('[kredits] person', address, person);

            let contributor = Contributor.create({
              address: address,
              ipfsHash: person[2],
              kredits: balance.toNumber(),
              isCurrentUser: this.get('currentUserAccounts').includes(address)
            });

            contributor.loadProfile(this.get('ipfs')).then(
              () => resolve(contributor),
              err => reject(err)
            );
          });
        });
      }).catch(err => reject(err));
    });
    return promise;
  },

  getContributors() {
    return this.getValueFromContract('kreditsContract', 'contributorsCount').then(contributorsCount => {
      let contributors = [];

      for(var i = 0; i < contributorsCount.toNumber(); i++) {
        contributors.push(this.getContributorData(i));
      }

      return Ember.RSVP.all(contributors);
    });
  },

  getProposalData(i) {
    let promise = new Ember.RSVP.Promise((resolve, reject) => {
      this.getValueFromContract('kreditsContract', 'proposals', i).then(p => {
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
    return this.getValueFromContract('kreditsContract', 'proposalsCount').then(proposalsCount => {
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
        if (err) { reject(err); return; }
        Ember.Logger.debug('[kredits] vote response', data);
        resolve(data);
      });
    });
  },

  addContributor(contributor) {
    Ember.Logger.debug('[kredits] add contributor', contributor);

    contributor.setProperties({
      kredits: 0,
      isCurrentUser: this.get('currentUserAccounts').includes(contributor.address)
    });

    let id = uuid.v4();

    return new Ember.RSVP.Promise((resolve, reject) => {
      this.get('ipfs').storeFile(contributor.serialize()).then(ipfsHash => {
        contributor.set('ipfsHash', ipfsHash);
        this.get('kreditsContract').addContributor(contributor.address, contributor.name, contributor.ipfsHash, contributor.isCore, id, (err, data) => {
          if (err) { reject(err); return; }
          Ember.Logger.debug('[kredits] add contributor response', data);
          resolve(contributor);
        });
      });
    });
  },

  addProposal(proposal) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      const {
        recipientAddress,
        amount,
        url
      } = proposal.getProperties('recipientAddress', 'amount', 'url');

      this.get('ipfs').storeFile(proposal.serializeContribution()).then(ipfsHash => {
        this.get('kreditsContract').addProposal(recipientAddress, amount, url, ipfsHash, (err, data) => {
          if (err) { reject(err); return; }
          Ember.Logger.debug('[kredits] add proposal response', data);
          resolve();
        });
      });
    });
  },

  // logKreditsContract: function() {
  //   Ember.Logger.debug('[kredits] kreditsContract', this.get('kreditsContract'));
  // }.on('init')

});
