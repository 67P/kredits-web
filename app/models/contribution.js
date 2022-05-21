import EmberObject, { computed } from '@ember/object';
import { isEmpty, isPresent } from '@ember/utils';
import moment from 'moment';

export default EmberObject.extend({
  // Contract
  id: null,
  contributorId: null,
  amount: null,
  confirmedAt: null,
  vetoed: null,
  ipfsHash: null,

  // contributor model instance
  contributor: null,

  // TODO contributor who submitted the contribution
  // submittedBy: null,

  // IPFS
  kind: null,
  description: null,
  details: null,
  url: null,
  date: null,
  time: null,

  pendingTx: null,

  init () {
    this._super(...arguments);
    if (isEmpty(this.details)) this.set('details', {});
  },

  iso8601Date: computed('date', 'time', function() {
    return this.time ? `${this.date}T${this.time}` : this.date;
  }),

  jsDate: computed('iso8601Date', function() {
    return moment(this.iso8601Date).toDate();
  }),

  hasPendingChanges: computed('pendingTx', function() {
    return isPresent(this.pendingTx);
  }),

  serialize () {
    return JSON.stringify(this);
  }
});
