import Service from '@ember/service';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { isEmpty, isPresent } from '@ember/utils';
import RSVP from 'rsvp';
import Kredits from 'npm:kredits-contracts';
import Contributor from 'kredits-web/models/contributor'
import Proposal from 'kredits-web/models/proposal'
import ethers from 'npm:ethers';

import config from 'kredits-web/config/environment';

export default Service.extend({

  ethProvider: null,
  currentUserAccounts: null, // default to not having an account. this is the wen web3 is loaded.
  currentUser: null,
  currentUserIsContributor: computed('currentUser', function() {
    return isPresent(this.currentUser);
  }),
  currentUserIsCore: alias('currentUser.isCore'),
  hasAccounts: computed('currentUserAccounts', function() {
    return !isEmpty(this.currentUserAccounts);
  }),
  accountNeedsUnlock: computed('currentUserAccounts', function() {
    return this.currentUserAccounts && isEmpty(this.currentUserAccounts);
  }),

  // this is called called in the routes beforeModel().  So it is initialized before everything else
  // and we can rely on the ethProvider and the potential currentUserAccounts to be available
  initEthProvider: function() {
    return new RSVP.Promise((resolve) => {
      let ethProvider;
      let networkId;
      if (typeof window.web3 !== 'undefined') {
        console.debug('[kredits] Using user-provided instance, e.g. from Mist browser or Metamask');
        networkId = parseInt(window.web3.version.network);
        ethProvider = new ethers.providers.Web3Provider(window.web3.currentProvider, {chainId: networkId});
        ethProvider.listAccounts().then((accounts) => {
          this.set('currentUserAccounts', accounts);
          this.set('ethProvider', ethProvider);
          resolve(ethProvider);
        });
      } else {
        console.debug('[kredits] Creating new instance from npm module class');
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
          if (this.currentUserAccounts.length > 0) {
            this.getCurrentUser.then((contributorData) => {
              this.set('currentUser', contributorData);
            });
          }
          return kredits;
        });
    });
  },

  totalSupply: computed(function() {
    return this.kredits.Token.functions.totalSupply();
  }),

  contributors: [],
  proposals: [],

  loadContributorsAndProposals() {
    return this.getContributors()
               .then(contributors => this.contributors.pushObjects(contributors))
               .then(() => this.getProposals())
               .then(proposals => this.proposals.pushObjects(proposals))
  },

  // TODO: Only assign valid attributes
  // buildModel(name, attributes) {
  //   console.debug('[kredits] build', name, attributes);
  //   let model = getOwner(this).lookup(`model:${name}`);
  //
  //   model.setProperties(attributes);
  //   return model;
  // },

  addContributor(attributes) {
    console.debug('[kredits] add contributor', attributes);

    return this.kredits.Contributor.add(attributes)
      .then((data) => {
        console.debug('[kredits] add contributor response', data);
        return Contributor.create(attributes);
      });
  },

  getContributors() {
    return this.kredits.Contributor.all()
      .then((contributors) => {
        return contributors.map((contributor) => {
          return Contributor.create(contributor);
        });
      });
  },

  addProposal(attributes) {
    console.debug('[kredits] add proposal', attributes);

    return this.kredits.Operator.addProposal(attributes)
      .then((data) => {
        console.debug('[kredits] add proposal response', data);
        attributes.contributor = this.contributors.findBy('id', attributes.contributorId);
        return Proposal.create(attributes);
      });
  },

  getProposals() {
    return this.kredits.Operator.all()
      .then((proposals) => {
        return proposals.map((proposal) => {
          proposal.contributor = this.contributors.findBy('id', proposal.contributorId.toString());
          return Proposal.create(proposal);
        });
      });
  },

  vote(proposalId) {
    console.debug('[kredits] vote for', proposalId);

    return this.kredits.Operator.functions.vote(proposalId)
      .then((data) => {
        console.debug('[kredits] vote response', data);
        return data;
      });
  },

  // TODO: Cleanup
  getCurrentUser: computed('ethProvider', function() {
    if (isEmpty(this.currentUserAccounts)) {
      return RSVP.resolve();
    }
    return this.kredits.Contributor
      .functions.getContributorIdByAddress(this.get('currentUserAccounts.firstObject'))
      .then((id) => {
        id = id.toNumber();
        // check if the user is a contributor or not
        if (id === 0) {
          return RSVP.resolve();
        } else {
          return this.kredits.Contributor.getById(id);
        }
      });
  }),

  findProposalById(proposalId) {
    return this.proposals.findBy('id', proposalId.toString());
  },

  // Contract events
  addContractEventHandlers() {
    // Operator events
    this.kredits.Operator
      .on('ProposalCreated', this.handleProposalCreated.bind(this))
      .on('ProposalVoted', this.handleProposalVoted.bind(this))
      .on('ProposalExecuted', this.handleProposalExecuted.bind(this));

    // Token events
    this.kredits.Token
      .on('Transfer', this.handleTransfer.bind(this));
  },

  handleProposalCreated(proposalId) {
    let proposal = this.findProposalById(proposalId);

    if (proposal) {
      console.debug('[events] proposal exists, not adding from event');
      return;
    }

    this.kredits.Operator.getById(proposalId)
      .then((proposal) => {
        proposal = this.buildModel('proposal', proposal);
        this.proposals.pushObject(proposal);
      });
  },

  // TODO: We may want to reload that proposal to show the voter as voted
  handleProposalVoted(proposalId, voterId, totalVotes) {
    let proposal = this.findProposalById(proposalId);

    if (proposal) {
      proposal.set('votesCount', totalVotes);
    }
  },

  handleProposalExecuted(proposalId, contributorId, amount) {
    let proposal = this.findProposalById(proposalId);

    if (proposal.get('isExecuted')) {
      console.debug('[events] proposal already executed, not adding from event');
      return;
    }

    proposal.set('executed', true);

    this.contributors
        .findBy('id', contributorId.toString())
        .incrementProperty('balance', amount.toNumber());
  },

  handleTransfer(from, to, value) {
    value = value.toNumber();

    this.contributors
        .findBy('address', from)
        .decrementProperty('balance', value);

    this.contributors
        .findBy('address', to)
        .incrementProperty('balance', value);
  },
});
