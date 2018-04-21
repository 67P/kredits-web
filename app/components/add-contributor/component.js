import Component from '@ember/component';
import { computed } from '@ember/object';
import { and, notEmpty } from '@ember/object/computed';
import { inject as injectService } from '@ember/service';


export default Component.extend({
  kredits: injectService(),

  // Default attributes used by reset
  attributes: {
    account: null,
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
