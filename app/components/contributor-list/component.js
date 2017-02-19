import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'table',
  classNames: 'contributor-list',
  selectedContributor: null,

  actions: {

    toggleContributorInfo(contributor) {
      if (contributor.get('showMetadata')) {
        contributor.set('showMetadata', false);
      } else {
        this.get('contributors').setEach('showMetadata', false);
        contributor.set('showMetadata', true);
      }
    }

  }

});
