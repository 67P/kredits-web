import ethers from 'ethers';
import Kredits from '@kredits/contracts';

import Service from '@ember/service';
import EmberObject from '@ember/object';
import { computed } from '@ember/object';
import { alias, filterBy, notEmpty, sort } from '@ember/object/computed';
import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';

import { task, taskGroup } from 'ember-concurrency';

import groupBy from 'kredits-web/utils/group-by';
import processContributorData from 'kredits-web/utils/process-contributor-data';
import processContributionData from 'kredits-web/utils/process-contribution-data';
import processReimbursementData from 'kredits-web/utils/process-reimbursement-data';
import formatKredits from 'kredits-web/utils/format-kredits';
import switchNetwork from 'kredits-web/utils/switch-network';

import config from 'kredits-web/config/environment';
import Contributor from 'kredits-web/models/contributor';
import Contribution from 'kredits-web/models/contribution';
import Reimbursement from 'kredits-web/models/reimbursement';
// Lets us access the model classes dynamically
const models = { Contributor, Contribution, Reimbursement };

export default Service.extend({

  browserCache: service(),

  currentBlock: null,
  currentUserAccounts: null, // default to not having an account. this is the wen web3 is loaded.
  currentUser: null,
  contributors: null,
  contributions: null,
  reimbursements: null,
  githubAccessToken: null,

  currentUserIsContributor: notEmpty('currentUser'),
  currentUserIsCore: alias('currentUser.isCore'),
  hasAccounts: notEmpty('currentUserAccounts'),

  contributorsMined: filterBy('contributors', 'id'),
  contributorsSorting: Object.freeze(['name:asc']),
  contributorsSorted: sort('contributorsMined', 'contributorsSorting'),

  // When data was loaded from cache, we need to fetch updates from the network
  contributorsNeedSync: false,
  contributionsNeedSync: false,
  reimbursementsNeedSync: false,

  missingHistoricContributionsCount: 0,

  init () {
    this._super(...arguments);
    this.set('contributors', []);
    this.set('contributions', []);
    this.set('reimbursements', []);

    if (window.ethereum) {
      window.ethereum.on('chainChanged', this.handleUserChainChanged);
      window.ethereum.on('accountsChanged', this.handleAccountsChanged);
    }
  },

  handleUserChainChanged (chainId) {
    console.log('User-provided chain ID changed to', chainId);
    window.location.reload();
  },

  handleAccountsChanged (accounts) {
    console.log('User-provided accounts changed to', accounts);
    window.location.reload();
  },

  // This is called in the application route's beforeModel(). So it is
  // initialized before everything else, and we can rely on the ethProvider and
  // the potential currentUserAccounts to be available
  getEthProvider () {
    let ethProvider;

    return new Promise(resolve => {
      function instantiateWithoutWallet () {
        console.debug('[kredits] Creating new instance from npm module class');
        console.debug(`[kredits] providerURL: ${config.web3ProviderUrl}`);
        ethProvider = new ethers.providers.JsonRpcProvider(config.web3ProviderUrl);
        resolve({
          ethProvider: ethProvider,
          ethSigner: null
        });
      }

      async function instantiateWithWallet (web3Provider, context) {
        console.debug('[kredits] Using user-provided Web3 instance, e.g. from Metamask');
        ethProvider       = new ethers.providers.Web3Provider(web3Provider);
        const network     = await ethProvider.getNetwork();
        const accounts    = await ethProvider.listAccounts();
        const chainId     = config.web3ChainId;

        if (isEmpty(accounts)) return instantiateWithoutWallet();

        if (network.chainId !== chainId) {
          return switchNetwork();
        } else {
          context.set('currentUserAccounts', accounts);
          const ethSigner = accounts.length === 0 ? null : ethProvider.getSigner();
          resolve({
            ethProvider,
            ethSigner
          });
        }
      }

      if (window.ethereum) {
        instantiateWithWallet(window.ethereum, this);
      } else {
        instantiateWithoutWallet();
      }
    });
  },

  async connectWallet () {
    const provider    = new ethers.providers.Web3Provider(window.ethereum);
    const network     = await provider.getNetwork();
    const chainId     = config.web3ChainId;
    const chainIdHex  = `0x${Number(chainId).toString(16)}`;

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (network.chainId !== chainId) await switchNetwork(chainIdHex);
    } catch (err) {
      console.log('Connecting wallet failed:', err);
      return false;
    }
  },

  async setup () {
    const kredits = await this.getEthProvider().then(providerAndSigner => {
      return new Kredits(providerAndSigner.ethProvider, providerAndSigner.ethSigner, {
        ipfsConfig: config.ipfs
      });
    });

    await kredits.init();
    this.set('kredits', kredits);
    this.set('currentBlock', await this.kredits.provider.getBlockNumber());
    this.kredits.provider.on('block', blockNumber => {
      console.debug('[kredits] New block mined:', blockNumber);
      this.set('currentBlock', blockNumber)
    });

    if (this.currentUserAccounts && this.currentUserAccounts.length > 0) {
      this.getCurrentUser.then(contributorData => {
        this.set('currentUser', contributorData);
      });
    }

    return kredits;
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
    return this.kredits.Contribution.functions.totalKreditsEarned(true);
  }),

  kreditsByContributor: computed('contributionsUnconfirmed.@each.vetoed', 'contributors.[]', function() {
    const contributionsUnconfirmed = this.contributionsUnconfirmed.filterBy('vetoed', false);
    const contributionsGrouped = groupBy(contributionsUnconfirmed, 'contributorId');
    const contributorsWithUnconfirmed = contributionsGrouped.map(c => c.value);
    const contributorsWithOnlyConfirmed = this.contributors.reject(c => contributorsWithUnconfirmed.includes(c.id))

    const kreditsByContributor = contributionsGrouped.map(c => {
      const amountUnconfirmed = c.items.mapBy('amount').reduce((a, b) => a + b);
      const contributor = this.contributors.findBy('id', c.value);

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
    return this.contributions
               .filter(c => c.confirmedAt > this.currentBlock);
  }),

  contributionsConfirmed: computed('contributions.[]', 'currentBlock', function() {
    return this.contributions
               .filterBy('vetoed', false)
               .filter(c => c.confirmedAt <= this.currentBlock);
  }),

  reimbursementsUnconfirmed: computed('reimbursements.[]', 'currentBlock', function() {
    return this.reimbursements
               .filter(r => r.confirmedAt > this.currentBlock);
  }),

  reimbursementsConfirmed: computed('reimbursements.[]', 'currentBlock', function() {
    return this.reimbursements
               .filterBy('vetoed', false)
               .filter(r => r.confirmedAt <= this.currentBlock);
  }),

  reimbursementsPending: computed('reimbursements.[]', 'pendingTx', function() {
    return this.reimbursements.filter(r => !r.id);
  }),

  async loadInitialData () {
    const numCachedContributors = await this.browserCache.contributors.length();
    if (numCachedContributors > 0) {
      await this.loadObjectsFromCache('Contributor');
      this.set('contributorsNeedSync', true);
    } else {
      await this.fetchContributors();
    }

    const numCachedContributions = await this.browserCache.contributions.length();
    if (numCachedContributions > 0) {
      await this.loadObjectsFromCache('Contribution');
      this.set('contributionsNeedSync', true);
    } else {
      await this.fetchContributions({ page: { size: 40 } });
    }

    await this.updateMissingHistoricContributionsCount();

    return Promise.resolve();
  },

  async updateMissingHistoricContributionsCount () {
    const contributionsCount = await this.kredits.Contribution.count;
    this.set('missingHistoricContributionsCount', contributionsCount - this.contributions.length);
    console.debug(`Missing ${this.missingHistoricContributionsCount} historic contributions (out of ${contributionsCount} overall)`)
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

  async fetchContributor (id) {
    console.debug(`[kredits] Fetching contributor from the network`);
    return this.kredits.Contributor.getById(id)
      .then(data => this.loadContributorFromData(data))
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

  loadContributorFromData (data) {
    const contributor = Contributor.create(processContributorData(data));
    const loadedContributor = this.contributors.findBy('id', contributor.id);
    if (loadedContributor) { this.contributors.removeObject(loadedContributor); }
    this.contributors.pushObject(contributor);
    return contributor;
  },

  async cacheLoadedContributors () {
    for (const c of this.contributors) {
      await this.browserCache.contributors.setItem(c.id.toString(), c.serialize());
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
    this.set('contributorsNeedSync', false);
  }),

  addContribution (attributes) {
    console.debug('[kredits] Adding contribution', attributes);

    return this.kredits.Contribution.add(attributes, { gasLimit: 300000 })
      .then(data => {
        console.debug('[kredits] Contribution.add response', data);
        attributes.contributor = this.contributors.findBy('id', attributes.contributorId);
        const contribution = Contribution.create(attributes);
        contribution.set('pendingTx', data);
        contribution.set('confirmedAtBlock', this.currentBlock + 40320);
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
    contribution.set('contributor', this.contributors.findBy('id', data.contributorId));
    const loadedContribution = this.contributions.findBy('id', contribution.id);
    if (loadedContribution) { this.contributions.removeObject(loadedContribution); }
    this.contributions.pushObject(contribution);
    return contribution;
  },

  async cacheLoadedContributions () {
    for (const c of this.contributions) {
      await this.browserCache.contributions.setItem(c.id.toString(), c.serialize());
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
    yield this.updateMissingHistoricContributionsCount();
    this.set('contributionsNeedSync', false);
  }).group('contributionTasks'),

  fetchNewContributions: task(function * () {
    const count = yield this.kredits.Contribution.count;
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
    const count = yield this.kredits.Contribution.count;
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
  // Generic data handling (for objects that can be vetoed)
  //

  fetchObjects(objectClass, options = { page: { size: 200 } }) {
    const objectClassLowerCase = objectClass.toLowerCase();
    console.debug(`[kredits] Fetching ${objectClassLowerCase}s from the network`);
    return this.kredits[objectClass].all(options)
      .then(objects => {
        return objects.map(data => {
          const classInstance = this[`load${objectClass}FromData`](data);
          return classInstance;
        });
      })
      .then(objects => {
        const cacheWrites = objects.map(o => {
          return this.browserCache[objectClassLowerCase+'s']
                     .setItem(o.id.toString(), o.serialize());
        });
        return Promise.all(cacheWrites).then(() => {
          console.debug(`[kredits] Cached ${objects.length} ${objectClassLowerCase+'s'} in browser storage`);
        });
      });
  },

  removeObjectFromCollectionIfLoaded (collection, objectId) {
    const loadedObj = this[collection].findBy('id', objectId);
    if (loadedObj) { this[collection].removeObject(loadedObj); }
  },

  async cacheLoadedObjects (collection) {
    for (const o of this[collection]) {
      await this.browserCache[collection].setItem(o.id, o.serialize());
    }
    console.debug(`[kredits] Cached ${this[collection].length} ${collection} in browser storage`);
  },

  async loadObjectsFromCache (objectClass) {
    const collection = objectClass.toLowerCase()+'s';
    return this.browserCache[collection].iterate((value/*, key , iterationNumber */) => {
      const obj = models[objectClass].create(JSON.parse(value));
      this.removeObjectFromCollectionIfLoaded(collection, obj.id)
      this[collection].pushObject(obj);
    }).then((/* result */) => {
      console.debug(`[kredits] Loaded ${this[collection].length} ${collection} from cache`);
    });
  },

  syncTaskGroup: taskGroup().enqueue(),

  fetchNewObjects: task(function * (objectClass) {
    const collection = objectClass.toLowerCase()+'s';
    const count = yield this.kredits[objectClass].functions[`${collection}Count`]();
    const lastKnownObjectId = Math.max.apply(null, this[collection].mapBy('id'));
    const toFetch = count - lastKnownObjectId;

    if (toFetch > 0) {
      console.debug(`[kredits] Fetching ${toFetch} new ${collection}`);
      for (let id = lastKnownObjectId; id <= count; id++) {
        const data = yield this.kredits[objectClass].getById(id);
        const o = this[`load${objectClass}FromData`](data);
        yield this.browserCache[collection].setItem(o.id.toString(), o.serialize());
      }
    } else {
      console.debug(`[kredits] No new ${collection} to fetch`);
    }
  }),

  fetchMissingObjects: task(function * (objectClass) {
    const collection = objectClass.toLowerCase()+'s';
    const count = yield this.kredits[objectClass].functions[`${collection}Count`]();
    const allIds = [...Array(count+1).keys()];
    allIds.shift(); // remove first item, which is 0
    const loadedObjects = new Set(this[collection].mapBy('id'));
    const toFetch = allIds.filter(id => !loadedObjects.has(id));
    if (toFetch.length === 0) {
      console.debug(`[kredits] No ${collection} left to fetch`);
      return;
    }
    console.debug(`[kredits] Fetching ${toFetch.length} past ${collection}`);
    let countFetched = 0;

    for (let id = count; id > 0; id--) {
      if (loadedObjects.has(id)) {
        continue;
      } else {
        const data = yield this.kredits[objectClass].getById(id);
        const o = this[`load${objectClass}FromData`](data);
        yield this.browserCache[collection].setItem(o.id.toString(), o.serialize());
        countFetched++;
        if (countFetched % 20 === 0) {
          console.debug(`[kredits] Fetched ${countFetched} more ${collection}`);
        }
      }
    }
    console.debug(`[kredits] Cached ${countFetched} past ${collection}`);
  }),

  syncUnconfirmedObjects: task(function * (objectClass) {
    const collection = objectClass.toLowerCase()+'s';
    if (this.get(`${collection}Unconfirmed`).length > 0) {
      console.debug(`[kredits] Syncing unconfirmed ${collection}`);
      for (const o of this[`${collection}Unconfirmed`]) {
        if (isEmpty(o.id)) return;
        const data = yield this.kredits[objectClass].getById(o.id);
        const object = this[`load${objectClass}FromData`](data);
        yield this.browserCache[collection]
                  .setItem(o.id.toString(), object.serialize());
      }
    } else {
      console.debug(`[kredits] No unconfirmed ${collection} to sync`);
    }
  }),

  vetoAgainstObject (objectClass, objectId) {
    console.debug(`[kredits] veto against ${objectClass.toLowerCase()}`, objectId);
    const collection = objectClass.toLowerCase()+'s';
    const object = this[collection].findBy('id', objectId);

    return this.kredits[objectClass].functions.veto(objectId, { gasLimit: 300000 })
      .then(data => {
        console.debug('[kredits] veto response', data);
        object.set('pendingTx', data);
        return data;
      });
  },

  //
  // Reimbursements
  //

  loadReimbursementFromData(data) {
    const obj = Reimbursement.create(processReimbursementData(data));
    obj.set('contributor', this.contributors.findBy('id', data.recipientId));
    this.removeObjectFromCollectionIfLoaded('reimbursements', obj.id);
    this.reimbursements.pushObject(obj);
    return obj;
  },

  addReimbursement (attributes) {
    console.debug('[kredits] add reimbursement', attributes);

    return this.kredits.Reimbursement.add(attributes, { gasLimit: 300000 })
      .then(data => {
        console.debug('[kredits] add reimbursement response', data);
        const reimbursement = Reimbursement.create(attributes);
        reimbursement.setProperties({
          contributor: this.contributors.findBy('id', attributes.recipientId),
          pendingTx: data,
          confirmedAt: this.currentBlock + 40320
        });
        this.reimbursements.pushObject(reimbursement);

        // Listen to tx mining/execution status
        data.wait()
            .then(d => console.debug('[kredits] tx successful', d))
            .catch(e => {
              window.alert('The transaction failed to execute. Please check the browser console.');
              console.log('[kredits] tx error', e);
            });

        return reimbursement;
      });
  },

  syncReimbursements: task(function * () {
    yield this.fetchNewObjects.perform('Reimbursement');
    yield this.syncUnconfirmedObjects.perform('Reimbursement');
    this.set('reimbursementsNeedSync', false);
  }).group('syncTaskGroup'),

  fetchMissingReimbursements: task(function * () {
    yield this.fetchMissingObjects.perform('Reimbursement');
  }).group('syncTaskGroup'),

  vetoReimbursement (id) {
    console.debug('[kredits] veto against reimbursement', id);
    const reimbursement = this.reimbursements.findBy('id', id);

    return this.kredits.Reimbursement.functions.veto(id, { gasLimit: 300000 })
      .then(data => {
        console.debug('[kredits] veto response', data);
        reimbursement.set('pendingTx', data);
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

    this.kredits.Reimbursement
      .on('ReimbursementAdded', this.handleReimbursementAdded.bind(this))
      .on('ReimbursementVetoed', this.handleReimbursementVetoed.bind(this))

    this.kredits.Token
      .on('Transfer', this.handleTransfer.bind(this));
  },

  async handleContributorChange (contributorId, ...args) {
    console.debug('[kredits] Contributor add/update event received for ID', contributorId);
    console.debug('[kredits] Event data:', args);
    const contributorData = await this.kredits.Contributor.getById(contributorId);
    const newContributor = Contributor.create(contributorData);

    // TODO check for actual differences in the contributor data first

    const oldContributor = this.contributors.findBy('id', contributorId);
    if (oldContributor) {
      // console.debug('[kredits] cached contributor', oldContributor);
      this.contributors.removeObject(oldContributor);
    }

    // console.debug('[kredits] incoming contributor data', newContributor);
    this.contributors.pushObject(newContributor);
  },

  async handleContributionAdded (id, contributorId, amount) {
    console.debug('[kredits] ContributionAdded event received', { id, contributorId, amount });

    const pendingContribution = this.contributions.find(c => {
      return (c.id === null) &&
             (c.contributorId === contributorId) &&
             (c.amount.toString() === amount.toString());
    });

    if (pendingContribution) {
      this.contributions.removeObject(pendingContribution);
    }

    const data = await this.kredits.Contribution.getById(id);
    const c = this.loadContributionFromData(data);
    await this.browserCache.contributions.setItem(c.id.toString(), c.serialize());
  },

  async handleContributionVetoed (contributionId) {
    console.debug('[kredits] ContributionVetoed event received for #', contributionId);
    const c = this.contributions.findBy('id', contributionId);

    if (c) {
      console.debug('[kredits] Updating contribution', c);
      c.set('vetoed', true);
      c.set('pendingTx', null);
      await this.browserCache.contributions.setItem(c.id.toString(), c.serialize());
    }
  },

  async handleReimbursementAdded (id, addedByAccount, amount) {
    console.debug('[kredits] ReimbursementAdded event received', { id, addedByAccount, amount });

    const pendingReimbursement = this.reimbursementsPending.find(r => {
      return r.amount.toString() === amount.toString();
    });

    if (pendingReimbursement) {
      console.debug('[kredits] Found a pending reimbursement matching the event. Replacing it with the final record...');
      this.reimbursements.removeObject(pendingReimbursement);
    }

    const data = await this.kredits.Reimbursement.getById(id);
    const r = this.loadReimbursementFromData(data);
    this.browserCache.reimbursements.setItem(r.id.toString(), r.serialize());
  },

  async handleReimbursementVetoed (id) {
    console.debug(`[kredits] ReimbursementVetoed received for #${id}`);
    const r = this.reimbursements.findBy('id', id);
    console.debug('[kredits] reimbursement', r);

    if (r) {
      r.set('vetoed', true);
      r.set('pendingTx', null);
      this.browserCache.reimbursements.setItem(r.id.toString(), r.serialize());
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
  }
});
