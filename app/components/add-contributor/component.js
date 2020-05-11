import Component from '@ember/component';
import { computed } from '@ember/object';
import { and, notEmpty } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';
import { isAddress } from 'web3-utils';

export default Component.extend({

  router: service(),
  kredits: service(),

  attributes: null,

  isValidAccount: computed('account', function() {
    return isAddress(this.account);
  }),

  isValidName: notEmpty('name'),
  isValidURL: notEmpty('url'),
  isValidGithubUID: notEmpty('github_uid'),
  isValidGithubUsername: notEmpty('github_username'),
  isValidGiteaUsername: notEmpty('gitea_username'),
  isValidWikiUsername: notEmpty('wiki_username'),
  isValidZoomDisplayName: notEmpty('zoom_display_name'),

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
      wiki_username: null,
      zoom_display_name: null
    });
  },

  reset: function() {
    this.setProperties(this.attributes);
  },

  actions: {

    submit (evt) {
      evt.preventDefault();

      if (!this.kredits.currentUserIsCore) {
        window.alert('Only core team members can edit profiles. Please ask someone to set you up.');
        return;
      }
      if (!this.isValid) {
        window.alert('Invalid data. Please review and try again.');
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
        this.router.transitionTo('dashboard');
      });
    }

  }

});
