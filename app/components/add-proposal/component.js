import Component from 'ember-component';
import computed, { and } from 'ember-computed';
import injectService from 'ember-service/inject';
import isPresent from 'kredits-web/utils/cps/is-present';

export default Component.extend({
  kredits: injectService(),

  // Default attributes used by reset
  attributes: {
    contributorId: null,
    kind: 'community',
    amount: null,
    description: null,
    url: null,
  },

  didInsertElement() {
    this._super(...arguments);
    this.reset();
  },

  contributors: [],

  isValidRecipient: isPresent('contributorId'),
  isValidAmount: computed('amount', function() {
    return parseInt(this.get('amount'), 10) > 0;
  }),
  isValidDescription: isPresent('description'),
  isValidUrl: isPresent('url'),
  isValid: and('isValidRecipient',
               'isValidAmount',
               'isValidDescription'),

  reset: function() {
    this.setProperties(this.get('attributes'));
  },

  actions: {
    submit() {
      if (!this.get('isValid')) {
        alert('Invalid data. Please review and try again.');
        return;
      }

      let attributes = Object.keys(this.get('attributes'));
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
