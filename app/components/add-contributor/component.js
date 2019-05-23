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
  isValidGiteaUsername: notEmpty('gitea_username'),
  isValidWikiUsername: notEmpty('wiki_username'),
  isValid: and(
    'isValidAccount',
    'isValidName',
    'isValidGithubUID'
  ),

  inProgress: false,

  init () {
    this._super(...arguments);

    this.set('attributes', {
      account: null,
      name: null,
      kind: 'person',
      url: null,
      github_username: null,
      github_uid: null,
      gitea_username: null,
      wiki_username: null
    });

    this.reset();
  },

  reset: function() {
    this.setProperties(this.attributes);
  },

  actions: {

    submit () {
      if (!this.isValid) {
        alert('Invalid data. Please review and try again.');
        return;
      }

      const attributes = Object.keys(this.attributes);
      const contributor = this.getProperties(attributes);

      this.set('inProgress', true);

      this.save(contributor).then(() => {
        this.reset();
        window.scroll(0,0);
      }).catch(err => {
        console.warn(err);
        window.alert('Something went wrong. Please check the browser console.');
      }).finally(() => {
        this.set('inProgress', false);
      });
    }

  }

});
