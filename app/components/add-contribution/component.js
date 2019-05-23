import Component from '@ember/component';
import { computed } from '@ember/object';
import { and, notEmpty } from '@ember/object/computed';

export default Component.extend({

  attributes: null,
  contributors: Object.freeze([]),

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
    this.set('defaultDate', new Date());

    // Default attributes used by reset
    this.set('attributes', {
      contributorId: null,
      kind: null,
      date: [new Date()],
      amount: null,
      description: null,
      url: null,
    });

    this.reset();
  },

  reset () {
    this.setProperties(this.attributes);
  },

  actions: {

    submit () {
      if (!this.isValid) {
        alert('Invalid data. Please review and try again.');
        return;
      }

      const attributes = this.getProperties(Object.keys(this.attributes));
      const [ date/* , time */ ] = attributes.date[0].toISOString().split('T');
      attributes.date = date;

      this.set('inProgress', true);

      this.save(attributes)
        .then((/*contribution*/) => {
          this.reset();
          window.scroll(0,0);
        }, err => {
          console.warn(err);
          window.alert('Something went wrong. Check the browser console for details.');
        })
        .finally(() => this.set('inProgress', false));

    }

  }

});