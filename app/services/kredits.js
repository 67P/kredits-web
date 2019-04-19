import ethers from 'npm:ethers';
import Kredits from 'npm:kredits-contracts';
import RSVP from 'rsvp';

import Service from '@ember/service';
import { computed } from '@ember/object';
import { alias, notEmpty } from '@ember/object/computed';
import { isEmpty } from '@ember/utils';

import formatKredits from 'kredits-web/utils/format-kredits';

import config from 'kredits-web/config/environment';
import Contributor from 'kredits-web/models/contributor'
import Proposal from 'kredits-web/models/proposal'
import Contribution from 'kredits-web/models/contribution'

export default Service.extend({

  currentBlock: null,
  currentUserAccounts: null, // default to not having an account. this is the wen web3 is loaded.
  currentUser: null,
  contributors: null,
  proposals: null,
  contributions: null,
  currentUserIsContributor: notEmpty('currentUser'),
  currentUserIsCore: alias('currentUser.isCore'),
  hasAccounts: notEmpty('currentUserAccounts'),
  accountNeedsUnlock: computed('currentUserAccounts', function() {
    return this.currentUserAccounts && isEmpty(this.currentUserAccounts);
  }),

  init () {
    this._super(...arguments);
    this.set('contributors', []);
    this.set('proposals', []);
    this.set('contributions', []);
  },

  // this is called in the routes beforeModel().  So it is initialized before everything else
  // and we can rely on the ethProvider and the potential currentUserAccounts to be available
  getEthProvider: function() {
    let ethProvider;

    return new RSVP.Promise(async (resolve) => {
      function instantiateWithoutAccount () {
        console.debug('[kredits] Creating new instance from npm module class');
        console.debug(`[kredits] providerURL: ${config.web3ProviderUrl}`);
        ethProvider = new ethers.providers.JsonRpcProvider(config.web3ProviderUrl);
        resolve({
          ethProvider: ethProvider,
          ethSigner: null
        });
      }

      function instantiateWithAccount (web3Provider, context) {
        console.debug('[kredits] Using user-provided instance, e.g. from Mist browser or Metamask');
        ethProvider = new ethers.providers.Web3Provider(web3Provider);
        ethProvider.listAccounts().then(accounts => {
          context.set('currentUserAccounts', accounts);
          const ethSigner = accounts.length === 0 ? null : ethProvider.getSigner();
          resolve({
            ethProvider,
            ethSigner
          });
        });
      }

      if (window.ethereum) {
        try {
          // Request account access if needed
          await window.ethereum.enable();
          // Acccounts now exposed
          instantiateWithAccount(window.ethereum, this);
        } catch (error) {
          instantiateWithoutAccount();
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        instantiateWithAccount(window.web3.currentProvider, this);
      }
      // Non-dapp browsers...
      else {
        instantiateWithoutAccount();
      }
    });
  },

  setup() {
    return this.getEthProvider().then((providerAndSigner) => {
      let kredits = new Kredits(providerAndSigner.ethProvider, providerAndSigner.ethSigner, {
        addresses: { Kernel: config.kreditsKernelAddress },
        apm: config.kreditsApmDomain,
        ipfsConfig: config.ipfs
      });
      return kredits
        .init()
        .then(async (kredits) => {
          this.set('kredits', kredits);
          this.set('currentBlock', await kredits.provider.getBlockNumber());

          if (this.currentUserAccounts && this.currentUserAccounts.length > 0) {
            this.getCurrentUser.then((contributorData) => {
              this.set('currentUser', contributorData);
            });
          }

          return kredits;
        });
    });
  },

  totalSupply: computed(function() {
    return this.kredits.Token.functions.totalSupply().then(total => {
      return formatKredits(total);
    })
  }),

  loadInitialData() {
    return this.getContributors()
               .then(contributors => this.contributors.pushObjects(contributors))
               .then(() => this.getContributions())
               .then(contributions => this.contributions.pushObjects(contributions))
  },

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

    return this.kredits.Proposal.addProposal(attributes)
      .then((data) => {
        console.debug('[kredits] add proposal response', data);
        attributes.contributor = this.contributors.findBy('id', attributes.contributorId);
        return Proposal.create(attributes);
      });
  },

  getProposals() {
    return this.kredits.Proposal.all()
      .then((proposals) => {
        return proposals.map((proposal) => {
          proposal.contributor = this.contributors.findBy('id', proposal.contributorId.toString());
          return Proposal.create(proposal);
        });
      });
  },

  getContributions() {
    return this.kredits.Contribution.all()
      .then(contributions => {
        return contributions.map(contribution => {
          contribution.contributor = this.contributors.findBy('id', contribution.contributorId.toString());
          return Contribution.create(contribution);
        });
      });
  },

  vote(proposalId) {
    console.debug('[kredits] vote for', proposalId);

    return this.kredits.Proposal.functions.vote(proposalId)
      .then((data) => {
        console.debug('[kredits] vote response', data);
        return data;
      });
  },

  getCurrentUser: computed('kredits.provider', function() {
    if (isEmpty(this.currentUserAccounts)) {
      return RSVP.resolve();
    }
    return this.kredits.Contributor
      .functions.getContributorIdByAddress(this.get('currentUserAccounts.firstObject'))
      .then((id) => {
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

  findContributionById(contributionId) {
    return this.contributions.findBy('id', contributionId.toString());
  },

  // Contract events
  addContractEventHandlers() {
    // Proposal events
    this.kredits.Proposal
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

    this.kredits.Proposal.getById(proposalId)
      .then((proposal) => {
        proposal.contributor = this.contributors.findBy('id', proposal.contributorId.toString());
        this.proposals.pushObject(Proposal.create(proposal));
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
        .incrementProperty('balance', amount);
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
