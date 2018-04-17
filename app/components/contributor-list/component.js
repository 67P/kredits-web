import Component from '@ember/component';

export default Component.extend({

  tagName: 'table',
  classNames: 'contributor-list',
  selectedContributor: null,

  actions: {

    toggleContributorInfo(contributor) {
      if (contributor.get('showMetadata')) {
        contributor.set('showMetadata', false);
      } else {
        this.contributors.setEach('showMetadata', false);
        contributor.set('showMetadata', true);
      }
    }

  }

});
