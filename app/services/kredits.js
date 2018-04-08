import ethers from 'npm:ethers';

import RSVP from 'rsvp';
import Ember from 'ember';
import Service from 'ember-service';
import injectService from 'ember-service/inject';
import computed, { alias } from 'ember-computed';
import { isEmpty, isPresent } from 'ember-utils';

import config from 'kredits-web/config/environment';

import abis from 'contracts/abis';
import addresses from 'contracts/addresses';
import {
  ContributionSerializer,
  ContributorSerializer,
  fromBytes32,
  toBytes32
} from 'kredits-web/lib/kredits';

const {
  getOwner,
  Logger: {
    debug,
    error
  }
} = Ember;


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
    let registry = new ethers.Contract(
      addresses['Registry'][networkId],
      abis['Registry'],
      this.get('ethProvider')
    );
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

  buildModel(name, attributes) {
    debug('[kredits] build', name, attributes);
    let model = getOwner(this).lookup(`model:${name}`);

    // coerce id to string
    if (attributes.id) {
      attributes.id = attributes.id.toString();
    }

    model.setProperties(attributes);
    return model;
  },

  getContributorById(id) {
    id = ethers.utils.bigNumberify(id);

    return this.get('contributorsContract')
      .then((contract) => contract.getContributorById(id))
      .then(this.reassembleIpfsHash)
      // Set basic data
      .then(({ account: address, balance, ipfsHash, isCore }) => {
        let isCurrentUser = this.get('currentUserAccounts').includes(address);

        return {
          id: id,
          address,
          balance: balance.toNumber(),
          ipfsHash,
          isCore,
          isCurrentUser,
        };
      })
      // Fetch IPFS data if available
      .then((data) => {
        return this.fetchAndMergeIpfsData(data, ContributorSerializer);
      })
      .then((attributes) => {
        return this.buildModel('contributor', attributes);
      });
  },

  getContributors() {
    return this.get('contributorsContract')
      .then((contract) => contract.contributorsCount())
      .then((count) => {
        count = count.toNumber();
        debug('[kredits] contributors count:', count);
        let contributors = [];

        for(var id = 1; id <= count; id++) {
          contributors.push(this.getContributorById(id));
        }

        return RSVP.all(contributors);
      });
  },

  reassembleIpfsHash(data) {
    let { ipfsHash: digest, hashFunction, hashSize } = data;
    data.ipfsHash = fromBytes32({ digest, hashFunction, hashSize });
    delete data.hashFunction;
    delete data.hashSize;

    return data;
  },

  /**
   * Loads the contributor's profile data from IPFS and returns the attributes
   *
   * @method
   * @public
   */
  fetchAndMergeIpfsData(data, Serializer) {
    let ipfsHash = data.ipfsHash;

    if (!ipfsHash) {
      return data;
    }

    return this.get('ipfs')
      .getFile(ipfsHash)
      .then(Serializer.deserialize)
      .then((attributes) => {
        debug('[kredits] fetched ipfs data:', attributes);
        return Object.assign({}, data, attributes);
      })
      .catch((err) => {
        error('[kredits] error trying to fetch', ipfsHash, err);
      });
  },

  getProposalById(id) {
    id = ethers.utils.bigNumberify(id);

    return this.get('kreditsContract')
      .then((contract) => contract.proposals(id))
      .then(this.reassembleIpfsHash)
      // Set basic data
      .then(({
        creator: creatorAddress,
        recipientId,
        votesCount,
        votesNeeded,
        amount,
        executed,
        ipfsHash,
      }) => {
        return {
          id: id,
          creatorAddress,
          recipientId: recipientId.toString(),
          votesCount: votesCount.toNumber(),
          votesNeeded: votesNeeded.toNumber(),
          amount: amount.toNumber(),
          executed,
          ipfsHash
        };
      })
      // Fetch IPFS data if available
      .then((data) => {
        return this.fetchAndMergeIpfsData(data, ContributionSerializer);
      })
      .then((attributes) => {
        return this.buildModel('proposal', attributes);
      });
  },

  getProposals() {
    return this.get('kreditsContract')
      .then((contract) => contract.proposalsCount())
      .then((count) => {
        count = count.toNumber();
        debug('[kredits] proposals count:', count);
        let proposals = [];

        for(var i = 0; i < count; i++) {
          proposals.push(this.getProposalById(i));
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

  // TODO: extract common logic to module
  addContributor(attributes) {
    debug('[kredits] add contributor', attributes);

    let json = ContributorSerializer.serialize(attributes);
    // TODO: validate against schema

    return this.get('ipfs')
      .storeFile(json)
      // Set ipfsHash
      .then((ipfsHash) => {
        attributes.ipfsHash = ipfsHash;
        return attributes;
      })
      .then((attributes) => {
        return this.get('kreditsContract')
          .then((contract) => {
            let { address, isCore, ipfsHash } = attributes;
            let { digest, hashFunction, hashSize } = toBytes32(ipfsHash);

            let contributor = [
              address,
              digest,
              hashFunction,
              hashSize,
              isCore,
            ];
            debug('[kredits] addContributor', ...contributor);
            return contract.addContributor(...contributor);
          });
      })
      .then((data) => {
        debug('[kredits] add contributor response', data);
        return this.buildModel('contributor', attributes);
      });
  },

  addProposal(attributes) {
    debug('[kredits] add proposal', attributes);

    let json = ContributionSerializer.serialize(attributes);
    // TODO: validate against schema

    return this.get('ipfs')
      .storeFile(json)
      // Set ipfsHash
      .then((ipfsHash) => {
        delete attributes.contributorIpfsHash;
        attributes.ipfsHash = ipfsHash;
        return attributes;
      })
      .then((attributes) => {
        return this.get('kreditsContract')
          .then((contract) => {
            let { recipientId, amount, ipfsHash } = attributes;
            let { digest, hashFunction, hashSize } = toBytes32(ipfsHash);

            let proposal = [
              recipientId,
              amount,
              digest,
              hashFunction,
              hashSize,
            ];
            debug('[kredits] addProposal', ...proposal);
            return contract.addProposal(...proposal);
          });
      })
      .then((data) => {
        debug('[kredits] add proposal response', data);
        return this.buildModel('proposal', attributes);
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
            id = id.toNumber();
            // check if the user is a contributor or not
            if (id === 0) {
              return RSVP.resolve();
            } else {
              return this.getContributorById(id);
            }
          });
      });
  })
});
