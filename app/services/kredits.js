import Ember from 'ember';
import Web3 from 'npm:web3';
import config from 'kredits-web/config/environment';
import Contributor from 'kredits-web/models/contributor';
import Proposal from 'kredits-web/models/proposal';
import kreditsContracts from 'npm:kredits-contracts';
import Kredits from 'npm:kredits-contracts/operator';
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
      contract = new Kredits(this.get('web3'), config.contractMetadata['Operator']);
    } else {
      contract = new Kredits(this.get('web3'));
    }

    return contract;
  },

  kreditsContract: function() {
    if (this.get('kreditsContractInstance')) {
      return this.get('kreditsContractInstance');
    }

    let contract = this.initializeKreditsContract();

    this.set('kreditsContractInstance', contract);

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

  getContributorData(id) {
    let kredits = this.get('kreditsContract');

    let promise = new Ember.RSVP.Promise((resolve, reject) => {
      kredits.getContributor(id).then(contributorData => {
        Ember.Logger.debug('[kredits] contributor', contributorData);
        let contributor = Contributor.create(contributorData);
        contributor.set('isCurrentUser', this.get('currentUserAccounts').includes(contributor.address));

        this.getValueFromContract('tokenContract', 'balanceOf', contributor.address).then(balance => {
          contributor.set('kredits', balance.toNumber());

          contributor.loadProfile(this.get('ipfs')).then(
            () => resolve(contributor),
            err => reject(err)
          );
        });
      }).catch(err => reject(err));
    });

    return promise;
  },

  getContributors() {
    return this.get('kreditsContract').contributorsCount().then(contributorsCount => {
      Ember.Logger.debug('[kredits] contributorsCount:', contributorsCount.toNumber());
      let contributors = [];

      for(var id = 1; id <= contributorsCount.toNumber(); id++) {
        contributors.push(this.getContributorData(id));
      }

      return Ember.RSVP.all(contributors);
    });
  },

  getProposalData(i) {
    let promise = new Ember.RSVP.Promise((resolve, reject) => {
      this.get('kreditsContract').proposals(i).then(p => {
        let proposal = Proposal.create({
          id               : i,
          creatorAddress   : p[0],
          recipientId      : p[1].toNumber(),
          votesCount       : p[2].toNumber(),
          votesNeeded      : p[3].toNumber(),
          amount           : p[4].toNumber(),
          executed         : p[5],
          ipfsHash         : p[6]
        });

        if (proposal.get('ipfsHash')) {
          proposal.loadContribution(this.get('ipfs')).then(
            () => resolve(proposal),
            err => reject(err)
          );
        } else {
          Ember.Logger.warn('[kredits] proposal from blockchain is missing IPFS hash', proposal);
          resolve(proposal);
        }
      }).catch(err => reject(err));
    });
    return promise;
  },

  getProposals() {
    return this.get('kreditsContract').proposalsCount().then(proposalsCount => {
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

  logOperatorContract: function() {
    Ember.Logger.debug('[kredits] operatorContract', this.get('kreditsContract'));
  }.on('init')

});
