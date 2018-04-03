import ethers from 'npm:ethers';
import bs58 from 'npm:bs58';
import NpmBuffer from 'npm:buffer';

import RSVP from 'rsvp';
import Ember from 'ember';
import Service from 'ember-service';
import injectService from 'ember-service/inject';
import computed from 'ember-computed';

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

  web3Instance: null,
  web3Provided: false, // Web3 provided (using Mist Browser, Metamask et al.)

  web3: function() {
    if (this.get('web3Provider')) {
      return this.get('web3Provider');
    }

    let web3Provider;
    if (typeof window.web3 !== 'undefined') {
      debug('[kredits] Using user-provided instance, e.g. from Mist browser or Metamask');
      let networkId = parseInt(web3.version.network);
      web3Provider = new ethers.providers.Web3Provider(web3.currentProvider, {chainId: networkId});
      this.set('web3Provided', true);
    } else {
      debug('[kredits] Creating new instance from npm module class');
      let providerUrl = localStorage.getItem('config:web3ProviderUrl') || config.web3ProviderUrl;
      let networkId = web3.version.network;
      web3Provider = new ethers.providers.JsonRpcProvider(providerUrl, {chainId: network});
    }

    this.set('web3Provider', web3Provider);
    return web3Provider;
  }.property('web3Provider'),

  listAccounts: function() {
    return this.get('web3').listAccounts();
  }.property('web3'),

  currentUserAccounts: function() {
    // TODO: listAccounts returns now a promise
    return [];
    return ethers.listAccounts();
    // return (this.get('web3Provided') && this.get('web3').eth.accounts) || [];
  }.property('web3Provided', 'web3'),

  registryContract: computed('web3', function() {
    let networkId = this.get('web3').chainId;
    let registry = new ethers.Contract(addresses['Registry'][networkId], abis['Registry'], this.get('web3'));
    return registry;
  }),

  contributorsContract: computed('web3', function() {
    return this.contractFor('Contributors');
  }),

  kreditsContract: computed('web3', function() {
    return this.contractFor('Operator');
  }),

  tokenContract: computed('web3', function() {
    return this.contractFor('Token');
  }),

  contractFor(name) {
    return this.get('registryContract').functions.getProxyFor(name)
      .then((address) => {
        debug('[kredits] get contract', name, address);
        return new ethers.Contract(address, abis[name], this.get('web3').getSigner());
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
          hashFunction: hashFunction.toNumber(),
          size: size.toNumber()
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
        let ipfsHash = this.getMultihashFromBytes32({ digest: p.ipfsHash, hashFunction: p.hashFunction, size: p.hashSize });

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
          kredits: 0,
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
});
