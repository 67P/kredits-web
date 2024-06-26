import Component from '@ember/component';
import { computed } from '@ember/object';
import { and, notEmpty } from '@ember/object/computed';
import { assign } from '@ember/polyfills';
import moment from 'moment';
import { inject as service } from '@ember/service';

export default Component.extend({
  kredits: service(),

  attributes: null,

  contributors: computed('kredits.contributorsSorted.[]', function() {
    return this.kredits.contributorsSorted.map(c => {
      return {
        id: c.id.toString(),
        name: c.name
      }
    })
  }),

  isValidContributor: notEmpty('contributorId'),
  isValidKind: notEmpty('kind'),
  isValidAmount: computed('amount', function() {
    return parseInt(this.amount, 10) > 0;
  }),
  isValidDescription: notEmpty('description'),
  isValidUrl: notEmpty('url'),
  isValid: and('isValidContributor',
               'isValidKind',
               'isValidAmount',
               'isValidDescription'),

  init () {
    this._super(...arguments);
    this.set('defaultDate', moment().startOf('hour').toDate());
    this.set('defaultAttr', {
      contributorId: null,
      kind: null,
      date: this.defaultDate,
      amount: null,
      description: null,
      url: null,
      details: null
    });

    this.set('attributes', assign({}, this.defaultAttr, this.attributes));

    this.reset();
  },

  reset () {
    this.setProperties(this.attributes);
  },

  actions: {

    submit (evt) {
      evt.preventDefault();

      if (!this.isValid) {
        alert('Invalid data. Please review and try again.');
        return;
      }

      const attributes = this.getProperties(Object.keys(this.attributes));

      attributes.contributorId = parseInt(this.contributorId);

      let dateInput = (attributes.date instanceof Array) ?
        attributes.date[0] : attributes.date;

      const [ date, time ] = dateInput.toISOString().split('T');
      [ attributes.date, attributes.time ] = [ date, time ];

      this.set('inProgress', true);

      this.save(attributes)
        .then((/*contribution*/) => {
          this.reset();
        }, err => {
          console.warn(err);
          window.alert('Something went wrong. Check the browser console for details.');
        })
        .finally(() => this.set('inProgress', false));
    }
  }
});
