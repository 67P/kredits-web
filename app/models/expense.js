import EmberObject, { computed } from '@ember/object';
import moment from 'moment';
import { A } from '@ember/array';

export default EmberObject.extend({
  title: null,
  description: null,
  currency: null,
  amount: null,
  date: null,
  url: null,
  tags: null,

  init () {
    this._super(...arguments);
    this.setDefaultValues();
  },

  iso8601Date: computed('date', 'time', function() {
    return this.time ? `${this.date}T${this.time}` : this.date;
  }),

  jsDate: computed('iso8601Date', function() {
    return moment(this.iso8601Date).toDate();
  }),

  setDefaultValues () {
    this.set('defaultDate', moment().startOf('hour').toDate());
    this.setProperties({
      title: '',
      description: '',
      currency: 'EUR',
      amount: 0,
      date: this.defaultDate,
      url: null,
      tags: A([])
    });
  },

  serialize () {
    return JSON.stringify(this);
  }
});
