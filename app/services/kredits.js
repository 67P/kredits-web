import Web3 from 'npm:web3';
import bs58 from 'npm:bs58';
import NpmBuffer from 'npm:buffer';

import RSVP from 'rsvp';
import Ember from 'ember';
import Service from 'ember-service';
import injectService from 'ember-service/inject';
import computed from 'ember-computed';

import config from 'kredits-web/config/environment';
import Contributor from 'kredits-web/models/contributor';
import Proposal from 'kredits-web/models/proposal';

import abis from 'contracts/abis';
import addresses from 'contracts/addresses';

const {
  Logger: {
    debug,
    warn
  }
} = Ember;

const Buffer = NpmBuffer.Buffer;

function contractProxy(object) {
  let proxy = Ember.ObjectProxy.extend({
    invoke(contractMethod, ...args) {
      debug('[kredits] invoke', contractMethod, ...args);
      let contract = this.get('content');
      return RSVP.denodeify(contract[contractMethod])(...args);
    }
  });

  return proxy.create({ content: object });
}

export default Service.extend({

  ipfs: injectService(),

  web3Instance: null,
  web3Provided: false, // Web3 provided (using Mist Browser, Metamask et al.)

  web3: function() {
    if (this.get('web3Instance')) {
      return this.get('web3Instance');
    }

    let web3Instance;

    if (typeof window.web3 !== 'undefined') {
      debug('[kredits] Using user-provided instance, e.g. from Mist browser or Metamask');
      web3Instance = window.web3;
      this.set('web3Provided', true);
    } else {
      debug('[kredits] Creating new instance from npm module class');
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

  registryContract: computed('web3', function() {
    let networkId = this.get('web3').version.network;
    let contract = this.get('web3')
      .eth
      .contract(abis['Registry'])
      .at(addresses['Registry'][networkId]);

    return RSVP.resolve(contractProxy(contract));
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
    return this.get('registryContract')
      .then((contract) => contract.invoke('getProxyFor', name))
      .then((address) => {
        debug('[kredits] get contract', name, address);
        let contract = this.get('web3')
          .eth
          .contract(abis[name])
          .at(address);

        return contractProxy(contract);
      });
  },

  getContributorData(id) {
    return this.get('contributorsContract')
      .then((contract) => contract.invoke('contributors', id))
      .then(contributorData => {
        debug('[kredits] contributor', contributorData);

        let [ address, digest, hashFunction, size, isCore ] = contributorData;

        let profileHash = this.getMultihashFromBytes32({
          digest,
          hashFunction: hashFunction.toNumber(),
          size: size.toNumber()
        });

        let isCurrentUser = this.get('currentUserAccounts').includes(address);

        return this.get('tokenContract')
          .then((contract) => contract.invoke('balanceOf', address))
          .then(balance => {
            let contributor = Contributor.create({
              id,
              address,
              profileHash,
              isCore,
              isCurrentUser,
              kredits: balance.toNumber()
            });

            // TODO: move ipfs into model
            return contributor.loadProfile(this.get('ipfs'));
          });
      });
  },

  getContributors() {
    return this.get('contributorsContract')
      .then((contract) => contract.invoke('contributorsCount'))
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
      .then((contract) => contract.invoke('proposals', i))
      .then(p => {

        let ipfsHash = this.getMultihashFromBytes32({
          digest: p[6],
          hashFunction: p[7].toNumber(),
          size: p[8].toNumber()
        });

        let proposal = Proposal.create({
          id               : i,
          creatorAddress   : p[0],
          recipientId      : p[1].toNumber(),
          votesCount       : p[2].toNumber(),
          votesNeeded      : p[3].toNumber(),
          amount           : p[4].toNumber(),
          executed         : p[5],
          ipfsHash         : ipfsHash
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
      .then((contract) => contract.invoke('proposalsCount'))
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
      .then((contract) => contract.invoke('vote', proposalId))
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
            return contract.invoke(
              'addContributor',
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
            return contract.invoke(
              'addProposal',
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
