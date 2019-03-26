import Component from '@ember/component';
import { and, notEmpty } from '@ember/object/computed';
import { inject as service } from '@ember/service';


export default Component.extend({
  kredits: service(),

  attributes: null,

  // TODO: add proper address validation
  isValidAccount: notEmpty('account'),
  isValidName: notEmpty('name'),
  isValidURL: notEmpty('url'),
  isValidGithubUID: notEmpty('github_uid'),
  isValidGithubUsername: notEmpty('github_username'),
  isValidWikiUsername: notEmpty('wiki_username'),
  isValid: and(
    'isValidAccount',
    'isValidName',
    'isValidGithubUID'
  ),

  init () {
    this._super(...arguments);

    // Default attributes used by reset
    this.set('attributes', {
      account: null,
      name: null,
      kind: 'person',
      url: null,
      github_username: null,
      github_uid: null,
      wiki_username: null,
      isCore: false
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
