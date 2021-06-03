import EmberObject, { computed } from '@ember/object';
import moment from 'moment';
import { isPresent } from '@ember/utils';

export default EmberObject.extend({

  // Contract
  id: null,
  recipientId: null,
  token: null,
  amount: null,
  confirmedAt: null,
  vetoed: null,
  ipfsHash: null,

  // contributor model instance
  recipient: null,

  // TODO contributor who submitted the reimbursement
  // recordedBy: null,

  // IPFS
  expenses: null, // Array of expense objects

  pendingTx: null,

  iso8601Date: computed('date', 'time', function() {
    return this.time ? `${this.date}T${this.time}` : this.date;
  }),

  jsDate: computed('iso8601Date', function() {
    return moment(this.iso8601Date).toDate();
  }),

  hasPendingChanges: computed('pendingTx', function() {
    return isPresent(this.pendingTx);
  }),

  pendingStatus: computed('pendingTx', function() {
    return isPresent(this.pendingTx) ? 'isPending' : 'notPending';
  }),

  serialize () {
    return JSON.stringify(this);
  }

});
