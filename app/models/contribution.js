import EmberObject, { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import bignumber from 'kredits-web/utils/cps/bignumber';
import moment from 'moment';

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
    if (isEmpty(this.details)) this.set('details', {});
  },

  iso8601Date: computed('date', 'time', function() {
    return this.time ? `${this.date}T${this.time}` : this.date;
  }),

  jsDate: computed('iso8601Date', function() {
    return moment(this.iso8601Date).toDate();
  })

});
