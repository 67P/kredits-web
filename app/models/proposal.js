import EmberObject from 'ember-object';
import computed, { alias } from 'ember-computed';
import injectService from 'ember-service/inject';
import bignumber from 'kredits-web/utils/cps/bignumber';

export default EmberObject.extend({
  kredits: injectService(),

  // Contract
  id: bignumber('idRaw', 'toString'),
  creatorAccount: null,
  contributorId: bignumber('contributorIdRaw', 'toString'),
  amount: bignumber('amountRaw', 'toNumber'),
  votesCount: bignumber('votesCountRaw', 'toNumber'),
  votesNeeded: bignumber('votesNeededRaw', 'toNumber'),
  executed: null,
  ipfsHash: null,

  // Shortcuts
  isExecuted: alias('executed'),

  // IPFS
  kind: null,
  description: null,
  details: {},
  url: null,
  ipfsData: '',

  // Relationships
  // TODO: Optimize it. We don't need to find the contributor every time we add a new one
  contributor: computed('contributorId', 'kredits.contributors.[]', function() {
    return this.get('kredits.contributors').findBy('id', this.get('contributorId'));
  })
});
