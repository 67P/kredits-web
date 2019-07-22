import Component from '@ember/component';
import { computed } from '@ember/object';
import { and, notEmpty } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';
import { isAddress } from 'web3-utils';

export default Component.extend({

  kredits: service(),

  attributes: null,

  isValidAccount: computed('ethAddress', function() {
    return isAddress(this.ethAddress);
  }),

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
    this.setDefaultAttributes();
    this.reset();
  },

  setDefaultAttributes () {
    if (isPresent(this.attributes)) { return; }

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
      }).catch(err => {
        console.warn(err);
        window.alert('Something went wrong. Please check the browser console.');
      }).finally(() => {
        this.set('inProgress', false);
      });
    }

  }

});
