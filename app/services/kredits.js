import ethers from 'ethers';
import Kredits from 'kredits-contracts';

import Service from '@ember/service';
import EmberObject from '@ember/object';
import { computed } from '@ember/object';
import { alias, notEmpty } from '@ember/object/computed';
import { isEmpty, isPresent } from '@ember/utils';
import { inject as service } from '@ember/service';

import { task, taskGroup } from 'ember-concurrency';

import groupBy from 'kredits-web/utils/group-by';
import processContributorData from 'kredits-web/utils/process-contributor-data';
import processContributionData from 'kredits-web/utils/process-contribution-data';
import formatKredits from 'kredits-web/utils/format-kredits';

import config from 'kredits-web/config/environment';
import Contributor from 'kredits-web/models/contributor'
import Contribution from 'kredits-web/models/contribution'

export default Service.extend({

  browserCache: service(),

  currentBlock: null,
  currentUserAccounts: null, // default to not having an account. this is the wen web3 is loaded.
  currentUser: null,
  contributors: null,
  contributions: null,
  githubAccessToken: null,

  currentUserIsContributor: notEmpty('currentUser'),
  currentUserIsCore: alias('currentUser.isCore'),
  hasAccounts: notEmpty('currentUserAccounts'),

  // When data was loaded from cache, we need to fetch updates from the network
  contributorsNeedSync: false,
  contributionsNeedSync: false,

  init () {
    this._super(...arguments);
    this.set('contributors', []);
    this.set('contributions', []);
  },

  // This is called in the application route's beforeModel(). So it is
  // initialized before everything else, and we can rely on the ethProvider and
  // the potential currentUserAccounts to be available
  getEthProvider () {
    let ethProvider;

    return new Promise(resolve => {
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

        const network = await ethProvider.getNetwork();
        if (isPresent(config.web3RequiredNetwork) &&
            network.name !== config.web3RequiredNetwork) {
          window.alert(`Please switch your Ethereum wallet to the "${config.web3RequiredNetwork}" network before connecting your account.`);
          return instantiateWithoutAccount();
        }

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
        if (window.ethereum.isConnected()) {
          instantiateWithAccount(window.ethereum, this);
        } else {
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

  getCurrentUser: computed('kredits.provider', 'currentUserAccounts.[]', function() {
    if (isEmpty(this.currentUserAccounts)) {
      return Promise.resolve();
    }
    return this.kredits.Contributor
      .functions.getContributorIdByAddress(this.currentUserAccounts.firstObject)
      .then((id) => {
        // check if the user is a contributor or not
        if (id === 0) {
          return Promise.resolve();
        } else {
          return this.kredits.Contributor.getById(id);
        }
      });
  }),

  totalSupply: computed(function() {
    return this.kredits.Token.functions.totalSupply().then(total => {
      return formatKredits(total);
    })
  }),

  totalKreditsEarned: computed(function() {
    return this.kredits.Contribution.functions.totalKreditsEarned(true)
      .then(total => total.toNumber());
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


  async loadInitialData () {
    const numCachedContributors = await this.browserCache.contributors.length();
    if (numCachedContributors > 0) {
      await this.loadContributorsFromCache();
      this.set('contributorsNeedSync', true);
    } else {
      await this.fetchContributors();
    }

    const numCachedContributions = await this.browserCache.contributions.length();
    if (numCachedContributions > 0) {
      await this.loadContributionsFromCache();
      this.set('contributionsNeedSync', true);
    } else {
      await this.fetchContributions({ page: { size: 30 } });
    }

    return Promise.resolve();
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

  fetchContributors () {
    console.debug(`[kredits] Fetching all contributors from the network`);
    return this.kredits.Contributor.all()
      .then(contributors => {
        return contributors.forEach(data => {
          this.loadContributorFromData(data);
          return;
        });
      })
      .then(() => {
        return this.cacheLoadedContributors();
      });
  },

  loadContributorFromData(data) {
    const contributor = Contributor.create(processContributorData(data));
    const loadedContributor = this.contributors.findBy('id', contributor.id);
    if (loadedContributor) { this.contributors.removeObject(loadedContributor); }
    this.contributors.pushObject(contributor);
    return contributor;
  },

  async cacheLoadedContributors () {
    for (const c of this.contributors) {
      await this.browserCache.contributors.setItem(c.id, c.serialize());
    }
    console.debug(`[kredits] Cached ${this.contributors.length} contributors in browser storage`);
    return Promise.resolve();
  },

  async loadContributorsFromCache () {
    return this.browserCache.contributors.iterate((value/*, key , iterationNumber */) => {
      this.contributors.pushObject(Contributor.create(JSON.parse(value)));
    }).then((/* result */) => {
      console.debug(`[kredits] Loaded ${this.contributors.length} contributors from cache`);
    });
  },

  syncContributors: task(function * () {
    yield this.fetchContributors();
  }),

  addContribution (attributes) {
    console.debug('[kredits] add contribution', attributes);

    return this.kredits.Contribution.addContribution(attributes, { gasLimit: 300000 })
      .then(data => {
        console.debug('[kredits] add contribution response', data);
        attributes.contributor = this.contributors.findBy('id', attributes.contributorId);
        const contribution = Contribution.create(attributes);
        contribution.set('pendingTx', data);
        contribution.set('confirmedAtBlock', data.blockNumber + 40320);
        this.contributions.pushObject(contribution);
        return contribution;
      });
  },

  fetchContributions (options = { page: { size: 200 } }) {
    console.debug(`[kredits] Fetching contributions from the network`);
    return this.kredits.Contribution.all(options)
      .then(contributions => {
        return contributions.map(data => {
          const contribution = this.loadContributionFromData(data);
          return contribution;
        });
      })
      .then(contributions => {
        const cacheWrites = contributions.map(c => {
          return this.browserCache.contributions.setItem(c.id.toString(), c.serialize());
        });
        return Promise.all(cacheWrites).then(() => {
          console.debug(`[kredits] Cached ${contributions.length} contributions in browser storage`);
        });
      });
  },

  loadContributionFromData(data) {
    const contribution = Contribution.create(processContributionData(data));
    contribution.set('contributor', this.contributors.findBy('id', data.contributorId.toString()));
    const loadedContribution = this.contributions.findBy('id', contribution.id);
    if (loadedContribution) { this.contributions.removeObject(loadedContribution); }
    this.contributions.pushObject(contribution);
    return contribution;
  },

  async cacheLoadedContributions () {
    for (const c of this.contributions) {
      await this.browserCache.contributions.setItem(c.id, c.serialize());
    }
    console.debug(`[kredits] Cached ${this.contributions.length} contributions in browser storage`);
    return Promise.resolve();
  },

  async loadContributionsFromCache () {
    return this.browserCache.contributions.iterate((value/*, key , iterationNumber */) => {
      this.contributions.pushObject(Contribution.create(JSON.parse(value)));
    }).then((/* result */) => {
      console.debug(`[kredits] Loaded ${this.contributions.length} contributions from cache`);
    });
  },

  contributionTasks: taskGroup().enqueue(),

  syncContributions: task(function * () {
    yield this.fetchNewContributions.perform();
    yield this.syncUnconfirmedContributions.perform();
  }).group('contributionTasks'),

  fetchNewContributions: task(function * () {
    const count = yield this.kredits.Contribution.count();
    const lastKnownContributionId = Math.max.apply(null, this.contributions.mapBy('id'));
    const toFetch = count - lastKnownContributionId;

    if (toFetch > 0) {
      console.debug(`[kredits] Fetching ${toFetch} new contributions`);
      for (let id = lastKnownContributionId; id <= count; id++) {
        const data = yield this.kredits.Contribution.getById(id);
        const c = this.loadContributionFromData(data);
        yield this.browserCache.contributions.setItem(c.id.toString(), c.serialize());
      }
    } else {
      console.debug(`[kredits] No new contributions to fetch`);
    }
  }),

  fetchMissingContributions: task(function * () {
    const count = yield this.kredits.Contribution.functions.contributionsCount();
    const allIds = [...Array(count+1).keys()];
    allIds.shift(); // remove first item, which is 0
    const loadedContributions = new Set(this.contributions.mapBy('id'));
    const toFetch = allIds.filter(id => !loadedContributions.has(id));
    if (toFetch.length === 0) {
      console.debug(`[kredits] No contributions left to fetch`);
      return;
    }
    console.debug(`[kredits] Fetching ${toFetch.length} past contributions`);
    let countFetched = 0;

    for (let id = count; id > 0; id--) {
      if (loadedContributions.has(id)) {
        continue;
      } else {
        const data = yield this.kredits.Contribution.getById(id);
        const c = this.loadContributionFromData(data);
        yield this.browserCache.contributions.setItem(c.id.toString(), c.serialize());
        countFetched++;
        if (countFetched % 20 === 0) {
          console.debug(`[kredits] Fetched ${countFetched} more contributions`);
        }
      }
    }
    console.debug(`[kredits] Cached ${countFetched} past contributions`);
  }).group('contributionTasks'),

  syncUnconfirmedContributions: task(function * () {
    if (this.contributionsUnconfirmed.length > 0) {
      console.debug(`[kredits] Syncing unconfirmed contributions`);
      for (const c of this.contributionsUnconfirmed) {
        const data = yield this.kredits.Contribution.getById(c.id);
        const contribution = this.loadContributionFromData(data);
        yield this.browserCache.contributions.setItem(c.id.toString(), contribution.serialize());
      }
    } else {
      console.debug(`[kredits] No unconfirmed contributions to sync`);
    }
  }),

  veto (contributionId) {
    console.debug('[kredits] veto against', contributionId);
    const contribution = this.contributions.findBy('id', contributionId);

    return this.kredits.Contribution.functions.veto(contributionId, { gasLimit: 300000 })
      .then(data => {
        console.debug('[kredits] veto response', data);
        contribution.set('pendingTx', data);
        return data;
      });
  },

  //
  // Contract events
  //

  addContractEventHandlers () {
    this.kredits.Contributor
      .on('ContributorProfileUpdated', this.handleContributorChange.bind(this))
      .on('ContributorAccountUpdated', this.handleContributorChange.bind(this))
      .on('ContributorAdded', this.handleContributorChange.bind(this))

    this.kredits.Contribution
      .on('ContributionAdded', this.handleContributionAdded.bind(this))
      .on('ContributionVetoed', this.handleContributionVetoed.bind(this))

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

  async handleContributionAdded (id, contributorId, amount) {
    console.debug('[kredits] ContributionAdded event received', { id, contributorId, amount });

    const pendingContribution = this.contributions.find(c => {
      return (c.id === null) &&
             (c.contributorId.toString() === contributorId.toString()) &&
             (c.amount.toString() === amount.toString());
    });

    if (pendingContribution) {
      const attributes = await this.kredits.Contribution.getById(id);
      attributes.contributor = this.contributors.findBy('id', attributes.contributorId.toString());
      const newContribution = Contribution.create(attributes);
      this.contributions.addObject(newContribution);
      this.contributions.removeObject(pendingContribution);
    }
  },

  handleContributionVetoed (contributionId) {
    console.debug('[kredits] ContributionVetoed event received for ', contributionId);
    const contribution = this.contributions.findBy('id', contributionId);
    console.debug('[kredits] contribution', contribution);

    if (contribution) {
      contribution.set('vetoed', true);
      contribution.set('pendingTx', null);
    }
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
