import Ember from 'ember';
import Contributor from 'kredits-web/models/contributor';

const {
  Component,
  isPresent,
  inject: {
    service
  },
  computed
} = Ember;

export default Component.extend({

  kredits: service(),

  newContributor: null,
  inProgress: false,

  isValidAddress: function() {
    return this.get('kredits.web3')
               .isAddress(this.get('newContributor.address'));
  }.property('kredits.web3', 'newContributor.address'),

  isValidName: function() {
    return isPresent(this.get('newContributor.name'));
  }.property('newContributor.name'),

  isValidURL: function() {
    return isPresent(this.get('newContributor.url'));
  }.property('newContributor.name'),

  isValidGithubUID: function() {
    return isPresent(this.get('newContributor.github_uid'));
  }.property('newContributor.github_uid'),

  isValidGithubUsername: function() {
    return isPresent(this.get('newContributor.github_username'));
  }.property('newContributor.github_username'),

  isValidWikiUsername: function() {
    return isPresent(this.get('newContributor.wiki_username'));
  }.property('newContributor.wiki_username'),

  isValid: computed.and(
    'isValidAddress',
    'isValidName',
    'isValidGithubUID'
  ),

  reset: function() {
    this.setProperties({
      newContributor: Contributor.create({ kind: 'person' }),
      inProgress: false
    });
  },

  actions: {

    save() {
      if (!this.get('contractInteractionEnabled')) {
        alert('Only core team members can add new contributors. Please ask someone to set you up.');
        return;
      }

      if (this.get('isValid')) {
        this.set('inProgress', true);

        this.get('kredits').addContributor(this.get('newContributor')).then(contributor => {
          this.reset();
          this.get('contributors').pushObject(contributor);
          window.scroll(0,0);
        });
      } else {
        alert('Invalid data. Please review and try again.');
      }
    }

  }

});
