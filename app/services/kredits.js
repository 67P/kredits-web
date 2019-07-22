import ethers from 'ethers';
import Kredits from 'kredits-contracts';
import RSVP from 'rsvp';

import Service from '@ember/service';
import EmberObject from '@ember/object';
import { computed } from '@ember/object';
import { alias, notEmpty } from '@ember/object/computed';
import { isEmpty } from '@ember/utils';

import groupBy from 'kredits-web/utils/group-by';
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
  contributions: null,
  proposals: null,

  currentUserIsContributor: notEmpty('currentUser'),
  currentUserIsCore: alias('currentUser.isCore'),
  hasAccounts: notEmpty('currentUserAccounts'),

  accountNeedsUnlock: computed('currentUserAccounts', function() {
    return this.currentUserAccounts && isEmpty(this.currentUserAccounts);
  }),

  contributionsUnconfirmed: computed('contributions.[]', 'currentBlock', function() {
    return this.contributions.filter(contribution => {
      return contribution.confirmedAt > this.currentBlock;
    });
  }),

  contributionsConfirmed: computed('contributions.[]', 'currentBlock', function() {
    return this.contributions
               .filterBy('vetoed', false)
               .filter(contribution => {
                 return contribution.confirmedAt <= this.currentBlock;
               });
  }),

  kreditsByContributor: computed('contributionsUnconfirmed.@each.vetoed', 'contributors.[]', function() {
    const contributionsUnconfirmed = this.contributionsUnconfirmed.filterBy('vetoed', false);
    const contributionsGrouped = groupBy(contributionsUnconfirmed, 'contributorId');
    const contributorsWithUnconfirmed = contributionsGrouped.map(c => c.value.toString());
    const contributorsWithOnlyConfirmed = this.contributors.reject(c => contributorsWithUnconfirmed.includes(c.id))

    const kreditsByContributor = contributionsGrouped.map(c => {
      const amountUnconfirmed = c.items.mapBy('amount').reduce((a, b) => a + b);
      const contributor = this.contributors.findBy('id', c.value.toString());

      return EmberObject.create({
        contributor: contributor,
        amountUnconfirmed: amountUnconfirmed,
        amountConfirmed: contributor.totalKreditsEarned,
        amountTotal: contributor.totalKreditsEarned + amountUnconfirmed
      })
    });

    contributorsWithOnlyConfirmed.forEach(c => {
      kreditsByContributor.push(EmberObject.create({
        contributor: c,
        amountUnconfirmed: 0,
        amountConfirmed: c.totalKreditsEarned,
        amountTotal: c.totalKreditsEarned
      }));
    })

    return kreditsByContributor;
  }),

  init () {
    this._super(...arguments);
    this.set('contributors', []);
    this.set('proposals', []);
    this.set('contributions', []);
  },

  // This is called in the application route's beforeModel(). So it is
  // initialized before everything else, and we can rely on the ethProvider and
  // the potential currentUserAccounts to be available
  getEthProvider () {
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

      async function instantiateWithAccount (web3Provider, context) {
        console.debug('[kredits] Using user-provided instance, e.g. from Mist browser or Metamask');
        ethProvider = new ethers.providers.Web3Provider(web3Provider);
        // const network = await ethProvider.getNetwork();
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

  getKreditsDeployedNetwork() {
    return Kredits.availableNetworks();
  },

  setup () {
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

  totalKreditsEarned: computed(function() {
    return this.kredits.Contribution.functions.totalKreditsEarned(true)
      .then(total => total.toNumber());
  }),


  loadInitialData () {
    return this.getContributors()
               .then(contributors => this.contributors.pushObjects(contributors))
               .then(() => this.getContributions())
               .then(contributions => this.contributions.pushObjects(contributions))
  },

  addContributor (attributes) {
    if (attributes.github_uid) {
      const uidInt = parseInt(attributes.github_uid);
      attributes.github_uid = uidInt;
    }

    console.debug('[kredits] add contributor', attributes);

    return this.kredits.Contributor.add(attributes, { gasLimit: 350000 })
      .then(data => {
        console.debug('[kredits] add contributor response', data);
      });
  },

  updateContributor (id, attributes) {
    if (attributes.github_uid) {
      const uidInt = parseInt(attributes.github_uid);
      attributes.github_uid = uidInt;
    }

    console.debug('[kredits] update contributor', attributes);

    return this.kredits.Contributor.updateProfile(id, attributes, { gasLimit: 350000 })
      .then(data => {
        console.debug('[kredits] updateProfile response', data);
      });
  },

  getContributors () {
    return this.kredits.Contributor.all()
      .then((contributors) => {
        return contributors.map((contributor) => {
          return Contributor.create(contributor);
        });
      });
  },

  addContribution (attributes) {
    console.debug('[kredits] add contribution', attributes);

    return this.kredits.Contribution.addContribution(attributes, { gasLimit: 300000 })
      .then(data => {
        console.debug('[kredits] add contribution response', data);
        attributes.contributor = this.contributors.findBy('id', attributes.contributorId);
        const contribution = Contribution.create(attributes);
        // TODO receive from wrapper
        contribution.set('confirmedAtBlock', data.blockNumber + 40320);
        this.contributions.pushObject(contribution);
        return contribution;
      });
  },

  addProposal (attributes) {
    console.debug('[kredits] add proposal', attributes);

    return this.kredits.Proposal.addProposal(attributes)
      .then((data) => {
        console.debug('[kredits] add proposal response', data);
        attributes.contributor = this.contributors.findBy('id', attributes.contributorId);
        return Proposal.create(attributes);
      });
  },

  getProposals () {
    return this.kredits.Proposal.all()
      .then((proposals) => {
        return proposals.map((proposal) => {
          proposal.contributor = this.contributors.findBy('id', proposal.contributorId.toString());
          return Proposal.create(proposal);
        });
      });
  },

  getContributions () {
    return this.kredits.Contribution.all({page: {size: 200}})
      .then(contributions => {
        return contributions.map(contribution => {
          contribution.contributor = this.contributors.findBy('id', contribution.contributorId.toString());
          return Contribution.create(contribution);
        });
      });
  },

  vote (proposalId) {
    console.debug('[kredits] vote for', proposalId);

    return this.kredits.Proposal.functions.vote(proposalId)
      .then(data => {
        console.debug('[kredits] vote response', data);
        return data;
      });
  },

  veto (contributionId) {
    console.debug('[kredits] veto against', contributionId);

    return this.kredits.Contribution.functions.veto(contributionId, { gasLimit: 300000 })
      .then(data => {
        console.debug('[kredits] veto response', data);
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

  // Contract events
  addContractEventHandlers () {
    this.kredits.Contributor
      .on('ContributorProfileUpdated', this.handleContributorChange.bind(this))
      .on('ContributorAccountUpdated', this.handleContributorChange.bind(this))
      .on('ContributorAdded', this.handleContributorChange.bind(this))

    this.kredits.Contribution
      .on('ContributionVetoed', this.handleContributionVetoed.bind(this))

    this.kredits.Proposal
      .on('ProposalCreated', this.handleProposalCreated.bind(this))
      .on('ProposalVoted', this.handleProposalVoted.bind(this))
      .on('ProposalExecuted', this.handleProposalExecuted.bind(this));

    this.kredits.Token
      .on('Transfer', this.handleTransfer.bind(this));
  },

  async handleContributorChange (contributorId, ...args) {
    console.debug('[kredits] Contributor add/update event received for ID', contributorId);
    console.debug('[kredits] Event data:', args);
    const contributorData = await this.kredits.Contributor.getById(contributorId);
    const newContributor = Contributor.create(contributorData);

    const oldContributor = this.contributors.findBy('id', contributorId.toString());
    if (oldContributor) {
      console.debug('[kredits] old contributor', oldContributor);
      this.contributors.removeObject(oldContributor);
    }

    console.debug('[kredits] new contributor', newContributor);
    this.contributors.pushObject(newContributor);
  },

  handleContributionVetoed (contributionId) {
    console.debug('[kredits] ContributionVetoed event received for ', contributionId);
    const contribution = this.contributions.findBy('id', contributionId);
    console.debug('[kredits] contribution', contribution);

    if (contribution) {
      contribution.set('vetoed', true);
    }
  },

  handleProposalCreated (proposalId) {
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
  handleProposalVoted (proposalId, voterId, totalVotes) {
    let proposal = this.findProposalById(proposalId);

    if (proposal) {
      proposal.set('votesCount', totalVotes);
    }
  },

  handleProposalExecuted (proposalId, contributorId, amount) {
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

  handleTransfer (from, to, value) {
    value = value.toNumber();

    this.contributors
        .findBy('address', from)
        .decrementProperty('balance', value);

    this.contributors
        .findBy('address', to)
        .incrementProperty('balance', value);
  },
});
