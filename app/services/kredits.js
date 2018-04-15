import ethers from 'npm:ethers';
import Kredits from 'kredits-web/lib/kredits';
import RSVP from 'rsvp';
import Ember from 'ember';
import Service from 'ember-service';
import computed, { alias } from 'ember-computed';
import { isEmpty, isPresent } from 'ember-utils';

import config from 'kredits-web/config/environment';

const {
  getOwner,
  Logger: {
    debug
  }
} = Ember;

export default Service.extend({
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
    return new RSVP.Promise((resolve) => {
      let ethProvider;
      let networkId;
      if (typeof window.web3 !== 'undefined') {
        debug('[kredits] Using user-provided instance, e.g. from Mist browser or Metamask');
        networkId = parseInt(window.web3.version.network);
        ethProvider = new ethers.providers.Web3Provider(window.web3.currentProvider, {chainId: networkId});
        ethProvider.listAccounts().then((accounts) => {
          this.set('currentUserAccounts', accounts);
          this.set('ethProvider', ethProvider);
          resolve(ethProvider);
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

  setup() {
    return this.initEthProvider().then((ethProvider) => {
      let signer = ethProvider.getSigner();
      return Kredits.setup(ethProvider, signer, config.ipfs).then((kredits) => {
          this.set('kredits', kredits);

          // TODO: Cleanup
          if (this.get('currentUserAccounts').length > 0) {
            this.get('getCurrentUser').then((contributorData) => {
              this.set('currentUser', contributorData);
            });
          }
          return kredits;
        });
    });
  },

  totalSupply: computed(function() {
    return this.get('kredits').Token.functions.totalSupply();
  }),

  contributors: [],
  proposals: [],

  loadContributorsAndProposals() {
    return RSVP.hash({
      contributors: this.getContributors(),
      proposals: this.getProposals(),
    }).then(({ contributors, proposals }) => {
      this.set('contributors', contributors);
      this.set('proposals', proposals);
    }).then(() => {
      this.get('kredits').Operator
        .on('ProposalCreated', (proposalId) => {
          this.handleProposalCreated(proposalId);
        })
        .on('ProposalVoted', (proposalId, voter, totalVotes) => {
          this.handleProposalVoted(proposalId, totalVotes);
        })
        .on('ProposalExecuted', (proposalId, contributorId, amount) => {
          this.handleProposalExecuted(proposalId, contributorId, amount);
        });

      this.get('kredits').Token
        .on('Transfer', (from, to, value) => {
          this.handleTransfer(from, to, value);
        });
    });
  },

  // TODO: Only assign valid attributes
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

  addContributor(attributes) {
    debug('[kredits] add contributor', attributes);

    return this.get('kredits').Contributor.add(attributes)
      .then((data) => {
        debug('[kredits] add contributor response', data);
        return this.buildModel('contributor', attributes);
      });
  },

  getContributors() {
    return this.get('kredits').Contributor.all()
      .then((contributors) => {
        return contributors.map((contributor) => {
          return this.buildModel('contributor', contributor);
        });
      });
  },

  addProposal(attributes) {
    debug('[kredits] add proposal', attributes);

    return this.get('kredits').Operator.addProposal(attributes)
      .then((data) => {
        debug('[kredits] add proposal response', data);
        return this.buildModel('proposal', attributes);
      });
  },

  getProposals() {
    return this.get('kredits').Operator.all()
      .then((proposals) => {
        return proposals.map((proposal) => {
          return this.buildModel('proposal', proposal);
        });
      });
  },

  vote(proposalId) {
    debug('[kredits] vote for', proposalId);

    return this.get('kredits').Operator.functions.vote(proposalId)
      .then((data) => {
        debug('[kredits] vote response', data);
        return data;
      });
  },

  // TODO: Cleanup
  getCurrentUser: computed('ethProvider', function() {
    if (isEmpty(this.get('currentUserAccounts'))) {
      return RSVP.resolve();
    }
    return this.get('kredits').Contributor
      .functions.getContributorIdByAddress(this.get('currentUserAccounts.firstObject'))
      .then((id) => {
        id = id.toNumber();
        // check if the user is a contributor or not
        if (id === 0) {
          return RSVP.resolve();
        } else {
          return this.get('kredits').Contributor.getById(id);
        }
      });
  }),

  findProposalById(proposalId) {
    return this.get('proposals').findBy('id', proposalId.toString());
  },

  // Contract events
  handleProposalCreated(proposalId) {
    let proposal = this.findProposalById(proposalId);

    if (proposal) {
      debug('[events] proposal exists, not adding from event');
      return;
    }

    this.get('kredits').Operator.getById(proposalId)
      .then((proposal) => {
        this.get('proposals').pushObject(proposal);
      });
  },

  // TODO: We may want to reload that proposal to show the voter as voted
  handleProposalVoted(proposalId, totalVotes) {
    let proposal = this.findProposalById(proposalId);

    if (proposal) {
      proposal.set('votesCount', totalVotes);
    }
  },

  handleProposalExecuted(proposalId, contributorId, amount) {
    let proposal = this.findProposalById(proposalId);

    if (proposal.get('isExecuted')) {
      debug('[events] proposal already executed, not adding from event');
      return;
    }

    proposal.set('executed', true);

    this.get('contributors')
        .findBy('id', contributorId.toString())
        .incrementProperty('balance', amount);
  },

  handleTransfer(from, to, value) {
    value = value.toNumber();

    this.get('contributors')
        .findBy('address', from)
        .decrementProperty('balance', value);

    this.get('contributors')
        .findBy('address', to)
        .incrementProperty('balance', value);
  },
});
