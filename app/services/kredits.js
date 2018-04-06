import ethers from 'npm:ethers';
import bs58 from 'npm:bs58';
import NpmBuffer from 'npm:buffer';

import RSVP from 'rsvp';
import Ember from 'ember';
import Service from 'ember-service';
import injectService from 'ember-service/inject';
import computed, { alias } from 'ember-computed';
import { isEmpty, isPresent } from 'ember-utils';

import config from 'kredits-web/config/environment';
import Proposal from 'kredits-web/models/proposal';

import abis from 'contracts/abis';
import addresses from 'contracts/addresses';

const {
  getOwner,
  Logger: {
    debug,
    warn
  }
} = Ember;

const Buffer = NpmBuffer.Buffer;

export default Service.extend({

  ipfs: injectService(),

  ethProvider: null,
  currentUserAccounts: null, // default to not having an account. this is the wen web3 is loaded.
  currentUser: null,
  currentUserIsContributor: computed('currentUser', function() {
    return isPresent(this.get('currentUser'));
  }),
  currentUserIsCore: alias('currentUser.isCore'),
  hasAccounts: computed('currentUserAccounts', function() {
    return !isEmpty(this.get('currentUserAccounts'));
  }),
  accountNeedsUnlock: computed('currentUserAccounts', function() {
    return this.get('currentUserAccounts') && isEmpty(this.get('currentUserAccounts'));
  }),

  // this is called called in the routes beforeModel().  So it is initialized before everything else
  // and we can rely on the ethProvider and the potential currentUserAccounts to be available
  initEthProvider: function() {
    return new Ember.RSVP.Promise((resolve) => {
      let ethProvider;
      let networkId;
      if (typeof window.web3 !== 'undefined') {
        debug('[kredits] Using user-provided instance, e.g. from Mist browser or Metamask');
        networkId = parseInt(window.web3.version.network);
        ethProvider = new ethers.providers.Web3Provider(window.web3.currentProvider, {chainId: networkId});
        ethProvider.listAccounts().then((accounts) => {
          this.set('currentUserAccounts', accounts);
          this.set('ethProvider', ethProvider);
          if (accounts.length > 0) {
            this.get('getCurrentUser').then((contributorData) => {
              this.set('currentUser', contributorData);
              resolve(ethProvider);
            });
          } else {
            resolve(ethProvider);
          }
        });
      } else {
        debug('[kredits] Creating new instance from npm module class');
        let providerUrl = localStorage.getItem('config:web3ProviderUrl') || config.web3ProviderUrl;
        networkId = parseInt(config.contractMetadata.networkId);
        ethProvider = new ethers.providers.JsonRpcProvider(providerUrl, {chainId: networkId});
        this.set('ethProvider', ethProvider);
        resolve(ethProvider);
      }
      window.ethProvider = ethProvider;
    });
  },

  registryContract: computed('ethProvider', function() {
    let networkId = this.get('ethProvider').chainId;
    let registry = new ethers.Contract(addresses['Registry'][networkId], abis['Registry'], this.get('ethProvider'));
    return registry;
  }),

  contributorsContract: computed('ethProvider', function() {
    return this.contractFor('Contributors');
  }),

  kreditsContract: computed('ethProvider', function() {
    return this.contractFor('Operator');
  }),

  tokenContract: computed('ethProvider', function() {
    return this.contractFor('Token');
  }),

  contractFor(name) {
    return this.get('registryContract').functions.getProxyFor(name)
      .then((address) => {
        debug('[kredits] get contract', name, address);
        return new ethers.Contract(address, abis[name], this.get('ethProvider').getSigner());
      });
  },

  getContributorData(id) {
    return this.get('contributorsContract')
      .then((contract) => contract.contributors(id))
      .then((data) => {
        debug('[kredits] contributor', data);

        let [ address, digest, hashFunction, size, isCore ] = data;
        let isCurrentUser = this.get('currentUserAccounts').includes(address);
        let profileHash = this.getMultihashFromBytes32({
          digest,
          hashFunction: hashFunction,
          size: size
        });
        return this.get('tokenContract')
          .then((contract) => contract.balanceOf(address))
          .then((balance) => {
            balance = balance.toNumber();

            let contributor = getOwner(this).lookup('model:contributor');
            contributor.setProperties({
              id,
              address,
              profileHash,
              isCore,
              isCurrentUser,
              balance
            });
            // Load data from IPFS
            contributor.loadProfile();
            return contributor;
          });
      });
  },

  getContributors() {
    return this.get('contributorsContract')
      .then((contract) => contract.contributorsCount())
      .then(contributorsCount => {
        debug('[kredits] contributorsCount:', contributorsCount.toNumber());
        let contributors = [];

        for(var id = 1; id <= contributorsCount.toNumber(); id++) {
          contributors.push(this.getContributorData(id));
        }

        return RSVP.all(contributors);
      });
  },

  getProposalData(i) {
    return this.get('kreditsContract')
      .then((contract) => contract.proposals(i))
      .then(p => {
        let contributionIpfsHash = this.getMultihashFromBytes32({ digest: p.ipfsHash, hashFunction: p.hashFunction, size: p.hashSize });

        let proposal = Proposal.create({
          id               : i,
          creatorAddress   : p.creator,
          recipientId      : p.recipientId.toNumber(),
          votesCount       : p.votesCount.toNumber(),
          votesNeeded      : p.votesNeeded.toNumber(),
          amount           : p.amount.toNumber(),
          executed         : p.executed,
          ipfsHash         : contributionIpfsHash
        });

        if (proposal.get('ipfsHash')) {
          // TODO: move ipfs into model
          return proposal
            .loadContribution(this.get('ipfs'))
            .then(() => { return proposal; });
        } else {
          warn('[kredits] proposal from blockchain is missing IPFS hash', proposal);
          return proposal;
        }
      });
  },

  getProposals() {
    return this.get('kreditsContract')
      .then((contract) => contract.proposalsCount())
      .then(proposalsCount => {
        let proposals = [];

        for(var i = 0; i < proposalsCount.toNumber(); i++) {
          proposals.push(this.getProposalData(i));
        }

        return RSVP.all(proposals);
      });
  },

  vote(proposalId) {
    debug('[kredits] vote for', proposalId);

    return this.get('kreditsContract')
      .then((contract) => contract.vote(proposalId))
      .then((data) => {
        debug('[kredits] vote response', data);
        return data;
      });
  },

  // TODO: move into utils
  getMultihashFromBytes32(multihash) {
    const { digest, hashFunction, size } = multihash;

    if (size === 0) {
      return;
    }

    const hashBytes = Buffer.from(digest.slice(2), 'hex');
    const multiHashBytes = new (hashBytes.constructor)(2 + hashBytes.length);

    multiHashBytes[0] = hashFunction; //contributorData[2];
    multiHashBytes[1] = size; //contributorData[3];
    multiHashBytes.set(hashBytes, 2);

    return bs58.encode(multiHashBytes);
  },

  getBytes32FromMultihash(multihash) {
    const decoded = bs58.decode(multihash);

    return {
      digest: `0x${decoded.slice(2).toString('hex')}`,
      hashFunction: decoded[0],
      size: decoded[1],
    };
  },

  addContributor(contributor) {
    debug('[kredits] add contributor', contributor);

    return this.get('ipfs')
      .storeFile(contributor.serialize())
      .then(profileHash => {
        contributor.setProperties({
          profileHash: profileHash,
          balance: 0,
          isCurrentUser: this.get('currentUserAccounts').includes(contributor.address)
        });

        let {
          digest, hashFunction, size
        } = this.getBytes32FromMultihash(profileHash);

        return this.get('kreditsContract')
          .then((contract) => {
            return contract.addContributor(
              contributor.address,
              digest,
              hashFunction,
              size,
              contributor.isCore
            );
          })
          .then((data) => {
            debug('[kredits] add contributor response', data);
            return contributor;
          });
      });
  },

  addProposal(proposal) {
    const {
      recipientAddress,
      amount,
      url
    } = proposal.getProperties('recipientAddress', 'amount', 'url');

    return this.get('ipfs')
      .storeFile(proposal.serializeContribution())
      .then(ipfsHash => {
        return this.get('kreditsContract')
          .then((contract) => {
            return contract.addProposal(
              recipientAddress,
              amount,
              url,
              ipfsHash
            );
          })
          .then((data) => {
            debug('[kredits] add proposal response', data);
            return data;
          });
      });
  },

  getCurrentUser: computed('ethProvider', function() {
    if (isEmpty(this.get('currentUserAccounts'))) {
      return RSVP.resolve();
    }
    return this.get('contributorsContract')
      .then((contract) => {
        return contract.getContributorIdByAddress(this.get('currentUserAccounts.firstObject'))
          .then((id) => {
            // check if the user is a contributor or not
            if( id.toNumber() === 0) {
              return RSVP.resolve();
            } else {
              return this.getContributorData(id.toNumber());
            }
          });
      });
  })
});
