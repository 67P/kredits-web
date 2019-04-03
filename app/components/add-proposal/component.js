import Component from '@ember/component';
import { computed } from '@ember/object';
import { and, notEmpty } from '@ember/object/computed';

export default Component.extend({

  attributes: null,
  contributors: Object.freeze([]),

  isValidContributor: notEmpty('contributorId'),
  isValidAmount: computed('amount', function() {
    return parseInt(this.amount, 10) > 0;
  }),
  isValidDescription: notEmpty('description'),
  isValidUrl: notEmpty('url'),
  isValid: and('isValidContributor',
               'isValidAmount',
               'isValidDescription'),

  init () {
    this._super(...arguments);

    // Default attributes used by reset
    this.set('attributes', {
      contributorId: null,
      kind: 'community',
      amount: null,
      description: null,
      url: null,
    });
  },

  didInsertElement() {
    this._super(...arguments);
    this.reset();
  },

  reset: function() {
    this.setProperties(this.attributes);
  },

  actions: {
    submit() {
      if (!this.isValid) {
        alert('Invalid data. Please review and try again.');
        return;
      }

      let attributes = Object.keys(this.attributes);
      let proposal = this.getProperties(attributes);
      let saved = this.save(proposal);

      // The promise handles inProgress
      this.set('inProgress', saved);

      saved.then(() => {
        this.reset();
        window.scroll(0,0);
        window.alert('Proposal added.');
      });
    }
  }

});
