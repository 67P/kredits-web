import EmberObject, { computed } from '@ember/object';
import bignumber from 'kredits-web/utils/cps/bignumber';

export default EmberObject.extend({

  // Contract
  id: null,
  contributorId: null,
  amount: null,
  confirmedAt: bignumber('confirmedAtBlock', 'toNumber'),
  vetoed: null,
  ipfsHash: null,

  creatorAccount: null,

  // IPFS
  kind: null,
  description: null,
  details: null,
  url: null,
  date: null,
  time: null,
  ipfsData: '',

  init () {
    this._super(...arguments);
    this.set('details', {});
  },

  iso8601Date: computed('date', 'time', function() {
    return this.time ? `${this.date}T${this.time}` : this.date;
  })

});
