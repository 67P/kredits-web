import Component from 'ember-component';
import computed, { and } from 'ember-computed';
import injectService from 'ember-service/inject';
import isPresent from 'kredits-web/utils/cps/is-present';


export default Component.extend({
  kredits: injectService(),

  // Default attributes used by reset
  attributes: {
    address: null,
    name: null,
    kind: 'person',
    url: null,
    github_username: null,
    github_uid: null,
    wiki_username: null,
    isCore: false,
  },

  didInsertElement() {
    this._super(...arguments);
    this.reset();
  },

  isValidAddress: computed('kredits.ethProvider', 'address', function() {
    // TODO: add proper address validation
    return this.get('address') !== '';
  }),
  isValidName: isPresent('name'),
  isValidURL: isPresent('url'),
  isValidGithubUID: isPresent('github_uid'),
  isValidGithubUsername: isPresent('github_username'),
  isValidWikiUsername: isPresent('wiki_username'),
  isValid: and(
    'isValidAddress',
    'isValidName',
    'isValidGithubUID'
  ),

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
      let contributor = this.getProperties(attributes);
      let saved = this.save(contributor);

      // The promise handles inProgress
      this.set('inProgress', saved);

      saved.then(() => {
        this.reset();
        window.scroll(0,0);
        window.alert('Contributor added.');
      });
    }
  }
});
